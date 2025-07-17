export const ENV_VARIABLES = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:713/api',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:713',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:713',
} as const;