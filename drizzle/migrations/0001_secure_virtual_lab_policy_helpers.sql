CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_practical_instructor(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_practical_member(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.is_instructor_for_student(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.can_register_for_practical(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.can_access_lab_session(uuid, uuid) SET SCHEMA private;
ALTER FUNCTION public.can_send_lab_message(uuid, uuid) SET SCHEMA private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION private.is_practical_instructor(_practical_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid()
    AND private.has_role(auth.uid(), 'instructor'::public.app_role)
    AND EXISTS (SELECT 1 FROM public.practicals p WHERE p.id = _practical_id AND p.instructor_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION private.is_practical_member(_practical_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid()
    AND private.has_role(auth.uid(), 'student'::public.app_role)
    AND EXISTS (SELECT 1 FROM public.practical_members pm WHERE pm.practical_id = _practical_id AND pm.student_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION private.is_instructor_for_student(_student_id uuid, _instructor_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _instructor_id IS NOT NULL AND _instructor_id = auth.uid()
    AND private.has_role(auth.uid(), 'instructor'::public.app_role)
    AND EXISTS (
      SELECT 1 FROM public.practical_members pm
      JOIN public.practicals p ON p.id = pm.practical_id
      WHERE pm.student_id = _student_id AND p.instructor_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION private.can_register_for_practical(_practical_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid()
    AND private.has_role(auth.uid(), 'student'::public.app_role)
    AND EXISTS (SELECT 1 FROM public.practicals p WHERE p.id = _practical_id AND p.status = 'scheduled'::public.practical_status);
$$;

CREATE OR REPLACE FUNCTION private.can_access_lab_session(_session_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.lab_sessions ls
    JOIN public.practicals p ON p.id = ls.practical_id
    WHERE ls.id = _session_id AND (
      (p.instructor_id = auth.uid() AND private.has_role(auth.uid(), 'instructor'::public.app_role))
      OR (private.has_role(auth.uid(), 'student'::public.app_role) AND EXISTS (
        SELECT 1 FROM public.practical_members pm WHERE pm.practical_id = p.id AND pm.student_id = auth.uid()
      ))
    )
  );
$$;

CREATE OR REPLACE FUNCTION private.can_send_lab_message(_session_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.lab_sessions ls
    JOIN public.practicals p ON p.id = ls.practical_id
    WHERE ls.id = _session_id AND ls.is_active AND p.status = 'live'::public.practical_status AND (
      (p.instructor_id = auth.uid() AND private.has_role(auth.uid(), 'instructor'::public.app_role))
      OR (private.has_role(auth.uid(), 'student'::public.app_role) AND EXISTS (
        SELECT 1 FROM public.practical_members pm WHERE pm.practical_id = p.id AND pm.student_id = auth.uid()
      ))
    )
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_practical_instructor(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_practical_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_instructor_for_student(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_register_for_practical(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_access_lab_session(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_send_lab_message(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_practical_instructor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_practical_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_instructor_for_student(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_register_for_practical(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_lab_session(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_send_lab_message(uuid, uuid) TO authenticated;