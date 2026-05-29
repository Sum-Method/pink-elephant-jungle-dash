# Security

The most important rule: do not commit real secrets.

Anything in this browser game can become visible to players, including:

- `src/`
- `public/`
- built JavaScript files
- GitHub Pages output in `docs/`
- `VITE_*` environment variables

## What Counts As A Secret

- private API keys
- database passwords
- service-account JSON
- payment secrets
- GitHub tokens
- private keys
- production credentials

## What Is Safe To Commit

- fake example values in `.env.example`
- public config such as a game title
- public asset paths
- docs and setup instructions

## Secret Leak Response

If a secret is accidentally committed:

1. Assume the secret is compromised.
2. Revoke or rotate it immediately.
3. Remove it from the code.
4. Check GitHub secret scanning alerts.
5. Review workflow logs.
6. Do not assume deleting the file makes the old secret safe.

## Frontend And Backend Boundary

A frontend-only GitHub Pages game cannot hide private credentials. If the game needs private API calls, accounts, payments, database writes, or protected admin actions, use a trusted backend, serverless function, or edge function.
