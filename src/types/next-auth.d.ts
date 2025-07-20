import { User as BlupayUser } from '@/sdk/types';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: BlupayUser;
    partnerBank?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    token: string;
    user: BlupayUser;
    partnerBank?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    user: BlupayUser;
    partnerBank?: string;
  }
}