import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)','/sign-up(.*)','/','/api(.*)','/trpc(.*)']);

export default clerkMiddleware(async (auth, request) => {
    if(!isPublicRoute(request)){
        await auth.protect();
    }
    //when its authenticated then when it access / it redirects to /dashboard

    const authObject=await auth.protect();
    const url=new URL(request.url);
    if(authObject.userId && (url.pathname==='/' || url.pathname==='/sign-in' || url.pathname=='/sign-up')){
        return NextResponse.redirect(new URL('/dashboard',request.url));
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}