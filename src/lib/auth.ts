/**
 * Utility to determine if the application is running in "Demo Mode".
 * Demo Mode is active when Clerk authentication keys are missing or set to placeholder values.
 * This allows for codebase exploration and UI testing without a functional Auth provider.
 */
export function getIsDemoMode() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return !key || key === "" || key.includes("YOUR_KEY_HERE") || key === "undefined";
}
