# Deployment Secrets & Run Instructions

This small reference lists the GitHub secrets and runtime secrets needed to deploy the application to Azure Web App using the manual GitHub Actions workflow `deploy-azure-manual.yml`.

Keep secrets out of source control. Store runtime secrets in Azure Key Vault and GitHub repository secrets where noted.

---

## GitHub Secrets (required for workflow)

- `AZURE_CREDENTIALS` (required)
  - Value: Azure service principal JSON created by `az ad sp create-for-rbac --sdk-auth`
  - Purpose: Allows GitHub Actions to authenticate with Azure to perform deployments.
  - How to create:
    ```bash
    az ad sp create-for-rbac --name "dag-japa-deployer" --role Contributor --scopes /subscriptions/<SUBSCRIPTION_ID> --sdk-auth
    ```
  - Copy entire JSON output into the `AZURE_CREDENTIALS` repository secret.

- `DATABASE_URL_staging` (required if `deploy_database=true` for staging)
  - Value: Full PostgreSQL connection string to your Azure Flexible Server.
  - Example format (Azure Flexible Server):
    ```text
    postgresql://<username>@<server>.postgres.database.azure.com:<port>/<db_name>?sslmode=require
    ```
  - Example with user/pass and additional params:
    ```text
    postgresql://pgadmin:SuperSecretPassword@dagjapa-db-staging.postgres.database.azure.com:5432/dag_japa_db?sslmode=require&connect_timeout=10
    ```
  - Purpose: Used by `npx prisma migrate deploy` running inside the workflow to run migrations against your database.

- `DATABASE_URL_production` (same as above, for production)

- `CR_PAT` (optional)
  - Value: GitHub personal access token (optional) if you push/pull container images from GHCR and need extra permissions.
  - Scopes: `read:packages`, `write:packages` or `repo` depending on use.

Notes
- The workflow will look up `DATABASE_URL_{environment}` using the `environment` input (i.e., `DATABASE_URL_staging` or `DATABASE_URL_production`).
- Ensure the secret names match exactly.

---

## Runtime Secrets (store securely in Azure Key Vault)

These are values your application requires at runtime. Instead of placing them in GitHub secrets, store them in Azure Key Vault and configure your App Service to read them.

- `NEXTAUTH_SECRET` — Random 32+ character secret for NextAuth
- `STRIPE_SECRET_KEY` — Stripe live/test secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — For email delivery
- `DATABASE_PASSWORD` — (if you prefer storing just password and compose the DB URL from app settings)

How to add to Key Vault
```bash
az keyvault secret set --vault-name <kv-name> --name NextAuthSecret --value "$(openssl rand -base64 32)"
az keyvault secret set --vault-name <kv-name> --name StripeSecretKey --value "sk_test_..."
```

Then configure your App Service to pull values or set app settings using `@Microsoft.KeyVault(VaultName=...;SecretName=...)` in ARM/Bicep templates or via Azure Portal.

---

## Prisma Migrations

- The workflow runs `npx prisma migrate deploy` when `deploy_database` is `true`.
- Requirements:
  - The `prisma/migrations` folder must be committed to the repository.
  - `schema.prisma` should reference the correct provider and any preview features.
  - The `DATABASE_URL_*` secret must be accessible from the runner (the runner must have network access to the DB host).

If your PostgreSQL Flexible Server blocks public access, either:
- Temporarily allow GitHub Actions runners to reach your DB (e.g., use an IP allow list or Azure service endpoints), or
- Run migrations from the App Service after deployment using a startup script or a one-off Job (requires a different approach).

---

## Example `DATABASE_URL` values (Azure Flexible Server)

- Basic example:
  ```text
  postgresql://pgadmin:Password123@dagjapa-db-staging.postgres.database.azure.com:5432/dag_japa_db?sslmode=require
  ```
- With application name and timeout:
  ```text
  postgresql://pgadmin:Password123@dagjapa-db-staging.postgres.database.azure.com:5432/dag_japa_db?sslmode=require&application_name=dag-japa&connect_timeout=10
  ```

Note: Azure Flexible Server can be configured to require SSL; use `?sslmode=require` as shown.

---

## Workflow Inputs (what you provide when running the workflow)

- `environment`: `staging` or `production`
- `app_name`: The existing Azure Web App name (e.g., `dag-japa-staging`)
- `resource_group`: The Azure Resource Group where the Web App exists
- `deploy_database`: `true` or `false` (whether to run Prisma migrations)

When running the workflow via the GitHub UI, fill these fields. When running via CLI, pass them as `-f` flags.

---

## How to trigger the workflow (examples)

### GitHub UI
1. Go to the **Actions** tab → select **Manual Deploy to Azure Web App**
2. Click **Run workflow**
3. Fill `environment`, `app_name`, `resource_group`, `deploy_database`
4. Click **Run workflow**

### GitHub CLI
```bash
gh workflow run deploy-azure-manual.yml \
  --repo sandyshd/dag-japa-nextjs \
  --ref main \
  -f environment=staging \
  -f app_name=dag-japa-staging \
  -f resource_group=dag-japa-staging \
  -f deploy_database=true
```

### Notes on network access for migrations
- If your PostgreSQL Flexible Server is private (restricted VNet), the GitHub Actions runner cannot reach it unless you open access or use self-hosted runners inside the same network.
- An alternative is to run `npx prisma migrate deploy` from the App Service after deployment (App Service has network access), but this requires a different automation approach (e.g., post-deploy script or a one-time job).

---

## Quick checklist before running the workflow

- [ ] `AZURE_CREDENTIALS` secret set
- [ ] `DATABASE_URL_staging` and/or `DATABASE_URL_production` set if `deploy_database` will be true
- [ ] `prisma/migrations` exists and is committed
- [ ] App Service exists (`app_name`) and is reachable
- [ ] App Service has network access to DB (or you plan to run migrations differently)
- [ ] Runtime secrets are in Azure Key Vault for App Service to consume

---

If you'd like, I can also:
- Add a short README reference and update `README.md` to link to this file.
- Add an alternative workflow that deploys a Docker image to Azure Web App (container) instead of ZIP deploy.

