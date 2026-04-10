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
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const isPrivate = isPrivateRoute(request);

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", request.nextUrl.pathname);
  console.log("User ID:", userId);
  console.log("Is Private Route:", isPrivate);

  // If user is not authenticated and trying to access a private route
  if (!userId && isPrivate) {
    console.log("Redirecting to login - no user");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated, check role-based access
  if (userId && isPrivate) {
    try {
      // Fetch user from Clerk to get metadata
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const userRole = user.unsafeMetadata?.role as string | undefined;

      console.log("User Role from unsafeMetadata:", userRole);
      console.log("Full unsafeMetadata:", user.unsafeMetadata);

      // If no role is set, redirect to home or role selection page
      if (!userRole) {
        console.log("No role found - redirecting to home");
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
      }

      // Check admin route access
      if (isAdminRoute(request)) {
        if (userRole !== "admin") {
          console.log("BLOCKING: Non-admin trying to access admin route");
          const homeUrl = new URL("/", request.url);
          return NextResponse.redirect(homeUrl);
        }
        console.log("Admin access granted");
      }

      // Check if jobseeker is trying to access employer routes
      if (userRole === "jobseeker" && isEmployerRoute(request)) {
        console.log("BLOCKING: Jobseeker trying to access employer route");
        const jobseekerUrl = new URL("/jobseeker", request.url);
        return NextResponse.redirect(jobseekerUrl);
      }

      // Check if employer is trying to access jobseeker routes
      if (userRole === "employer" && isJobseekerRoute(request)) {
        console.log("BLOCKING: Employer trying to access jobseeker route");
        const employerUrl = new URL("/employer", request.url);
        return NextResponse.redirect(employerUrl);
      }

      console.log("Access granted");
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    // Protect the route
    await auth.protect();
  }

  console.log("=== END MIDDLEWARE ===");
  return NextResponse.next();
});

export const config = {
  matcher: [
    // exclude Next internals and common static file extensions (include json)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
