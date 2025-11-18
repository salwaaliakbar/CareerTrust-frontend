// app/actions/getUserRole.ts
"use server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserRole(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.unsafeMetadata?.role;
}
