# saliguri

## Environment setup

Copy `.env.local.example` to `.env.local` and set your Supabase values before running the app.

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `RESEND_API_KEY`

The repository already ignores `.env*`, so secrets stay out of version control.
