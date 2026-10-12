CREATE TABLE public.approved_instructor_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (email = lower(btrim(email))),
  is_super_admin boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.approved_instructor_emails TO authenticated;
GRANT ALL ON public.approved_instructor_emails TO service_role;
ALTER TABLE public.approved_instructor_emails ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX approved_instructor_emails_email_lower_uidx ON public.approved_instructor_emails (lower(email));

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1
    FROM auth.users AS u
    JOIN public.approved_instructor_emails AS a
      ON lower(a.email) = lower(u.email)
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
      AND a.is_super_admin
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

CREATE POLICY approved_instructor_emails_read_own_or_admin
ON public.approved_instructor_emails
FOR SELECT TO authenticated
USING (
  public.is_super_admin()
  OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

CREATE POLICY approved_instructor_emails_add_by_super_admin
ON public.approved_instructor_emails
FOR INSERT TO authenticated
WITH CHECK (
  public.is_super_admin()
  AND NOT is_super_admin
  AND created_by = auth.uid()
);

CREATE POLICY approved_instructor_emails_remove_by_super_admin
ON public.approved_instructor_emails
FOR DELETE TO authenticated
USING (public.is_super_admin() AND NOT is_super_admin);

CREATE OR REPLACE FUNCTION public.sync_verified_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.app_role;
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.approved_instructor_emails AS a
    WHERE lower(a.email) = lower(NEW.email)
  ) THEN
    assigned_role := 'instructor'::public.app_role;
  ELSE
    assigned_role := 'student'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_verified_role
AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_verified_user_role();

CREATE OR REPLACE FUNCTION public.sync_role_for_approved_email_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_email text;
  affected_user_id uuid;
  affected_email_confirmed_at timestamptz;
  assigned_role public.app_role;
BEGIN
  IF TG_OP = 'DELETE' THEN
    affected_email := OLD.email;
  ELSE
    affected_email := NEW.email;
  END IF;

  SELECT u.id, u.email_confirmed_at
  INTO affected_user_id, affected_email_confirmed_at
  FROM auth.users AS u
  WHERE lower(u.email) = lower(affected_email)
  LIMIT 1;

  IF affected_user_id IS NOT NULL THEN
    IF affected_email_confirmed_at IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.approved_instructor_emails AS a
      WHERE lower(a.email) = lower(affected_email)
    ) THEN
      assigned_role := 'instructor'::public.app_role;
    ELSE
      assigned_role := 'student'::public.app_role;
    END IF;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (affected_user_id, assigned_role)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER sync_role_after_instructor_email_change
AFTER INSERT OR DELETE ON public.approved_instructor_emails
FOR EACH ROW EXECUTE FUNCTION public.sync_role_for_approved_email_change();

ALTER PUBLICATION supabase_realtime ADD TABLE public.practical_members;