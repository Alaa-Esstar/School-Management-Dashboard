import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./app/lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
    matcher: createRouteMatcher([route]),
    allowedRoles: routeAccessMap[route]
}))

const isProtectedRoute = createRouteMatcher(Object.keys(routeAccessMap));

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const { sessionClaims } = await auth.protect();

        const role = (sessionClaims?.metadata as { role?: string })?.role;
        for (const { matcher, allowedRoles } of matchers) {
            if (matcher(req) && !allowedRoles.includes(role!)) {
                return NextResponse.redirect(new URL(`/${role}`, req.url));
            }
        }
    }
    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};