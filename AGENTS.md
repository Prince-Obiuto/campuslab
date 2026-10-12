<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store account details in `public.profiles` and authorization roles in `public.user_roles`; separating identity from permissions prevents users from escalating privileges through profile edits.
- Scope practicals to their instructor and derive room access from the practical membership record so live state and chat remain isolated to each lab.
- Authenticate users through Cloud Auth and let database row policies enforce roles and room access; this keeps credentials off device-local profiles and prevents UI-only authorization.
- Resolve instructor privileges from verified email approvals and anchor super-admin access to the initial owner identity; this prevents public sign-up role selection from granting elevated access.
