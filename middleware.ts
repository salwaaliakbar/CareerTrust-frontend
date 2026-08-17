import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// Define route matchers for each role
const isJobseekerRoute = createRouteMatcher(["(.*)/jobseeker(.*)"]);
const isEmployerRoute = createRouteMatcher(["(.*)/employer(.*)"]);
const isAdminRoute = createRouteMatcher(["(.*)/admin/admindashboard(.*)"]);

// All private routes combined
const isPrivateRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/admin/admindashboard(.*)",
  "/employer/post-job(.*)",
  "/employer/candidates(.*)",
  "/employer/dashboard(.*)",
  "/employer/profile(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const isPrivate = isPrivateRoute(request);

  // If user is not authenticated and trying to access a private route
  if (!userId && isPrivate) {
    const loginUrl = new URL("/login", request.url);
    const destination = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("redirect", destination);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated, check role-based access
  if (userId && isPrivate) {
    try {
      // Fetch user from Clerk to get metadata
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const userRole = user.unsafeMetadata?.role as string | undefined;

      // If no role is set, redirect to home or role selection page
      if (!userRole) {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
      }

      // Check admin route access
      if (isAdminRoute(request) && userRole !== "admin") {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
      }

      // Check if jobseeker is trying to access employer routes
      if (userRole === "jobseeker" && isEmployerRoute(request)) {
        const jobseekerUrl = new URL("/jobseeker", request.url);
        return NextResponse.redirect(jobseekerUrl);
      }

      // Check if employer is trying to access jobseeker routes
      if (userRole === "employer" && isJobseekerRoute(request)) {
        const employerUrl = new URL("/employer", request.url);
        return NextResponse.redirect(employerUrl);
      }
    } catch (error) {
      console.error("Middleware error fetching user:", error);
    }

    // Protect the route
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // exclude Next internals and common static file extensions (include json)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
