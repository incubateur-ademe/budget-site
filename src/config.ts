import { ensureApiEnvVar, ensureNextEnvVar } from "@/utils/os";
import { isTruthy } from "@/utils/string";

export const config = {
  maintenance: ensureApiEnvVar(process.env.MAINTENANCE_MODE, isTruthy, false),
  /** First year of recorded activity */
  firstDate: new Date(2024, 0, 1),
  host: ensureNextEnvVar(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  name: "Budget Incubateur ADEME",
  tagline: "Site web de gestion des budgets de l'Incbateur de l'ADEME",
  env: ensureApiEnvVar<"dev" | "prod" | "staging">(process.env.APP_ENV, "dev"),
  matomo: {
    url: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_URL, ""),
    siteId: ensureNextEnvVar(process.env.NEXT_PUBLIC_MATOMO_SITE_ID, ""),
  },
  appVersion: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION, "dev"),
  appVersionCommit: ensureNextEnvVar(process.env.NEXT_PUBLIC_APP_VERSION_COMMIT, "<unknown>"),
  repositoryUrl: ensureNextEnvVar(
    process.env.NEXT_PUBLIC_REPOSITORY_URL,
    "https://github.com/incubateur-ademe/budget-site",
  ),
  api: {
    mailer: {
      host: ensureApiEnvVar(process.env.MAILER_SMTP_HOST, "127.0.0.1"),
      smtp: {
        port: ensureApiEnvVar(process.env.MAILER_SMTP_PORT, Number, 1025),
        password: ensureApiEnvVar(process.env.MAILER_SMTP_PASSWORD, ""),
        login: ensureApiEnvVar(process.env.MAILER_SMTP_LOGIN, ""),
        ssl: ensureApiEnvVar(process.env.MAILER_SMTP_SSL, isTruthy, false),
      },
      from: ensureApiEnvVar(process.env.MAILER_FROM_EMAIL, "Bot Incubateur ADEME <bot@incubateur-ademe.beta.gouv.fr>"),
    },
    security: {
      auth: {
        secret: ensureApiEnvVar(process.env.SECURITY_JWT_SECRET, "secret"),
      },
    },
    airtable: {
      apiKey: ensureApiEnvVar(process.env.AIRTABLE_API_KEY, ""),
      baseId: ensureApiEnvVar(process.env.AIRTABLE_BASE_ID, ""),
      appBaseId: ensureApiEnvVar(process.env.AIRTABLE_APP_BASE_ID, ""),
    },
  },
} as const;
