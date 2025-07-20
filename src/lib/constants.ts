export const ENV_VARIABLES = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:713/api',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:713',
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:713',
} as const;


export const ROUTES = {
    DASHBOARD: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },

    TRANSACTIONS: {
        INDEX: '/transactions',
        CREATE: '/transactions/create',
        EDIT: (id: string) => `/transactions/edit/${id}`,
        VIEW: (id: string) => `/transactions/view/${id}`,
    },
    COMMISSIONS: {
        INDEX: '/commissions',
        CREATE: '/commissions/create',
        EDIT: (id: string) => `/commissions/edit/${id}`,
        VIEW: (id: string) => `/commissions/view/${id}`,
    },
    MERCHANTS: {
        INDEX: '/merchants',
        CREATE: '/merchants/create',
        EDIT: (id: string) => `/merchants/edit/${id}`,
        VIEW: (id: string) => `/merchants/view/${id}`,
    },
    USERS: {
        INDEX: '/users',
        CREATE: '/users/create',
        EDIT: (id: string) => `/users/edit/${id}`,
        VIEW: (id: string) => `/users/view/${id}`,
    },

    PARTNER_BANKS: {
        INDEX: '/partner-banks',
        CREATE: '/partner-banks/create',
        EDIT: (id: string) => `/partner-banks/edit/${id}`,
        VIEW: (id: string) => `/partner-banks/view/${id}`,
    },
    DEVICES: {
        INDEX: '/devices',
        CREATE: '/devices/create',
        EDIT: (id: string) => `/devices/edit/${id}`,
        VIEW: (id: string) => `/devices/view/${id}`,
    }

} as const;