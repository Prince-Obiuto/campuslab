CREATE TYPE public.app_role AS ENUM ('student', 'instructor');
CREATE TYPE public.practical_status AS ENUM ('scheduled', 'live', 'ended');
GRANT USAGE ON TYPE public.app_role TO authenticated, service_role;
GRANT USAGE ON TYPE public.practical_status TO authenticated, service_role;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  academic_email text,
  academic_id text,
  department text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.practicals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  lab_topic text,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status public.practical_status NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practicals TO authenticated;
GRANT ALL ON public.practicals TO service_role;
ALTER TABLE public.practicals ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.practical_members (
  practical_id uuid NOT NULL REFERENCES public.practicals(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (practical_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.practical_members TO authenticated;
GRANT ALL ON public.practical_members TO service_role;
ALTER TABLE public.practical_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lab_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practical_id uuid NOT NULL UNIQUE REFERENCES public.practicals(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT false,
  current_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  ended_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_sessions TO authenticated;
GRANT ALL ON public.lab_sessions TO service_role;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_session_id uuid NOT NULL REFERENCES public.lab_sessions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text text NOT NULL CHECK (length(btrim(message_text)) > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX practicals_instructor_id_idx ON public.practicals (instructor_id);
CREATE INDEX practicals_status_start_idx ON public.practicals (status, scheduled_start);
CREATE INDEX practical_members_student_id_idx ON public.practical_members (student_id, registered_at DESC);
CREATE INDEX chat_messages_session_created_idx ON public.chat_messages (lab_session_id, created_at);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_practical_instructor(_practical_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL
    AND public.has_role(_user_id, 'instructor'::public.app_role)
    AND EXISTS (
      SELECT 1 FROM public.practicals p
      WHERE p.id = _practical_id AND p.instructor_id = _user_id
    );
$$;

CREATE OR REPLACE FUNCTION public.is_practical_member(_practical_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL
    AND public.has_role(_user_id, 'student'::public.app_role)
    AND EXISTS (
      SELECT 1 FROM public.practical_members pm
      WHERE pm.practical_id = _practical_id AND pm.student_id = _user_id
    );
$$;

CREATE OR REPLACE FUNCTION public.is_instructor_for_student(_student_id uuid, _instructor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _instructor_id IS NOT NULL
    AND public.has_role(_instructor_id, 'instructor'::public.app_role)
    AND EXISTS (
      SELECT 1
      FROM public.practical_members pm
      JOIN public.practicals p ON p.id = pm.practical_id
      WHERE pm.student_id = _student_id AND p.instructor_id = _instructor_id
    );
$$;

CREATE OR REPLACE FUNCTION public.can_register_for_practical(_practical_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL
    AND public.has_role(_user_id, 'student'::public.app_role)
    AND EXISTS (
      SELECT 1 FROM public.practicals p
      WHERE p.id = _practical_id AND p.status = 'scheduled'::public.practical_status
    );
$$;

CREATE OR REPLACE FUNCTION public.can_access_lab_session(_session_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.lab_sessions ls
    JOIN public.practicals p ON p.id = ls.practical_id
    WHERE ls.id = _session_id
      AND (
        (p.instructor_id = _user_id AND public.has_role(_user_id, 'instructor'::public.app_role))
        OR (
          public.has_role(_user_id, 'student'::public.app_role)
          AND EXISTS (
            SELECT 1 FROM public.practical_members pm
            WHERE pm.practical_id = p.id AND pm.student_id = _user_id
          )
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_send_lab_message(_session_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.lab_sessions ls
    JOIN public.practicals p ON p.id = ls.practical_id
    WHERE ls.id = _session_id
      AND ls.is_active
      AND p.status = 'live'::public.practical_status
      AND (
        (p.instructor_id = _user_id AND public.has_role(_user_id, 'instructor'::public.app_role))
        OR (
          public.has_role(_user_id, 'student'::public.app_role)
          AND EXISTS (
            SELECT 1 FROM public.practical_members pm
            WHERE pm.practical_id = p.id AND pm.student_id = _user_id
          )
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_practical_instructor(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_practical_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_instructor_for_student(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_register_for_practical(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_lab_session(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_send_lab_message(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_practical_instructor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_practical_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_instructor_for_student(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_register_for_practical(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_lab_session(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_send_lab_message(uuid, uuid) TO authenticated;

CREATE POLICY profiles_read_self_or_roster
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_instructor_for_student(id, auth.uid()));
CREATE POLICY profiles_update_self
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY user_roles_read_self
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY practicals_read_visible
ON public.practicals FOR SELECT TO authenticated
USING (
  public.is_practical_instructor(id, auth.uid())
  OR (
    public.has_role(auth.uid(), 'student'::public.app_role)
    AND (status = 'scheduled'::public.practical_status OR public.is_practical_member(id, auth.uid()))
  )
);
CREATE POLICY practicals_insert_by_owner
ON public.practicals FOR INSERT TO authenticated
WITH CHECK (
  instructor_id = auth.uid()
  AND public.has_role(auth.uid(), 'instructor'::public.app_role)
);
CREATE POLICY practicals_update_by_owner
ON public.practicals FOR UPDATE TO authenticated
USING (public.is_practical_instructor(id, auth.uid()))
WITH CHECK (public.is_practical_instructor(id, auth.uid()));
CREATE POLICY practicals_delete_by_owner
ON public.practicals FOR DELETE TO authenticated
USING (public.is_practical_instructor(id, auth.uid()));

CREATE POLICY practical_members_read_self_or_owned_roster
ON public.practical_members FOR SELECT TO authenticated
USING (
  (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'::public.app_role))
  OR public.is_practical_instructor(practical_id, auth.uid())
);
CREATE POLICY practical_members_register_self
ON public.practical_members FOR INSERT TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND public.can_register_for_practical(practical_id, auth.uid())
);
CREATE POLICY practical_members_remove_by_instructor
ON public.practical_members FOR DELETE TO authenticated
USING (public.is_practical_instructor(practical_id, auth.uid()));

CREATE POLICY lab_sessions_read_room_participants
ON public.lab_sessions FOR SELECT TO authenticated
USING (public.can_access_lab_session(id, auth.uid()));
CREATE POLICY lab_sessions_insert_by_instructor
ON public.lab_sessions FOR INSERT TO authenticated
WITH CHECK (
  public.is_practical_instructor(practical_id, auth.uid())
  AND (ended_by IS NULL OR ended_by = auth.uid())
);
CREATE POLICY lab_sessions_update_by_instructor
ON public.lab_sessions FOR UPDATE TO authenticated
USING (public.is_practical_instructor(practical_id, auth.uid()))
WITH CHECK (
  public.is_practical_instructor(practical_id, auth.uid())
  AND (ended_by IS NULL OR ended_by = auth.uid())
);
CREATE POLICY lab_sessions_delete_by_instructor
ON public.lab_sessions FOR DELETE TO authenticated
USING (public.is_practical_instructor(practical_id, auth.uid()));

CREATE POLICY chat_messages_read_room_participants
ON public.chat_messages FOR SELECT TO authenticated
USING (public.can_access_lab_session(lab_session_id, auth.uid()));
CREATE POLICY chat_messages_send_to_active_room
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND public.can_send_lab_message(lab_session_id, auth.uid())
);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, academic_email, academic_id, department)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data ->> 'academic_id', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'department', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'::public.app_role)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created_virtual_lab
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'practicals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.practicals;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'lab_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_sessions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END;
$$;