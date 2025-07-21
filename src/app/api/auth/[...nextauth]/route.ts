import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { authService } from '@/sdk/auth';
import { User } from '@/sdk/types';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        partnerBank: { label: 'Partner Bank', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          let loginResponse;
          
          if (credentials.partnerBank) {
            loginResponse = await authService.loginWithPartnerBank(
              {
                email: credentials.email,
                password: credentials.password,
              },
              credentials.partnerBank
            );
          } else {
            loginResponse = await authService.login({
              email: credentials.email,
              password: credentials.password,
            });
          }

          return {
            id: loginResponse.user.id,
            email: loginResponse.user.email,
            name: `${loginResponse.user.firstName} ${loginResponse.user.lastName}`,
            token: loginResponse.token,
            user: loginResponse.user,
            partnerBank: credentials.partnerBank,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user.user;
        token.partnerBank = user.partnerBank;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as User;
      session.partnerBank = token.partnerBank as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };