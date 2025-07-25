import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRoleEnum } from '@/sdk/types';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/auth')) {
      if (token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (!token && !pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const userRole = token?.user?.role;
    
    if (pathname.startsWith('/admin') && userRole !== UserRoleEnum.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (userRole === UserRoleEnum.ADMIN) {
        return NextResponse.next();
    }

    // Merchants page - accessible by ADMIN and PARTNER_BANK
    if (pathname.startsWith('/merchants') && 
        ![UserRoleEnum.PARTNER_BANK].includes(userRole as UserRoleEnum)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Partner Banks page - accessible by ADMIN only  
    if (pathname.startsWith('/partner-banks') && userRole !== UserRoleEnum.PARTNER_BANK) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Users page - accessible by ADMIN only
    if (pathname.startsWith('/users') && ![UserRoleEnum.MERCHANT].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/partner') && ![UserRoleEnum.PARTNER_BANK].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (pathname.startsWith('/merchant') && ![UserRoleEnum.MERCHANT, UserRoleEnum.SUB_MERCHANT].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        if (pathname.startsWith('/auth')) {
          return true;
        }
        
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};