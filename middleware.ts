import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api')) {  //api ko nhi rokenge
    return NextResponse.next();
  }

  const authObject=await auth();
  if(authObject.userId && (isPublicRoute(request) || url.pathname==='/')){
    //redirect it to dashboard
    return NextResponse.redirect(new URL('/dashboard',request.url));
  }

  if(!authObject.userId && (!isPublicRoute(request) && url.pathname!=='/')){
    //redirect it to sign in
    return NextResponse.redirect(new URL('/sign-in',request.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
