import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth()
  const pathname = req.nextUrl.pathname

  // Always allow access to home page for unauthenticated users
  if (pathname === '/' && !userId) {
    return NextResponse.next()
  }

  // Allow public routes to pass through for unauthenticated users
  if (isPublicRoute(req) && !userId) {
    return NextResponse.next()
  }

  // If not authenticated trying to access protected route, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Allow logged-in users without org to access home page
  if (userId && !orgId && pathname === '/') {
    return NextResponse.next()
  }

  // Redirect logged-in users with org away from home page
  if (userId && orgId && pathname === '/') {
    return NextResponse.redirect(new URL(`/organization/${orgId}`, req.url))
  }

  // Handle org selection logic for users without org (non-home pages)
  if (userId && !orgId && !pathname.startsWith('/select-org') && pathname !== '/') {
    return NextResponse.redirect(new URL('/select-org', req.url))
  }

  // If user has org but tries to access select-org, redirect to org page
  if (orgId && pathname.startsWith('/select-org')) {
    return NextResponse.redirect(new URL(`/organization/${orgId}`, req.url))
  }

  // Allow access to org pages if orgId exists
  if (pathname.startsWith('/organization') && orgId) {
    return NextResponse.next()
  }

  // Default allow for other protected routes
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}