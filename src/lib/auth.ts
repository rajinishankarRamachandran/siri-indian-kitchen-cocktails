import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
 
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	plugins: [bearer()],
	trustedOrigins: process.env.NODE_ENV === "production" 
		? [
			process.env.NEXT_PUBLIC_SITE_URL,
			...(process.env.TRUSTED_ORIGINS?.split(",") || []),
			"https://*.vercel.app" // Allow all Vercel preview deployments
		].filter(Boolean)
		: ["*"] // Allow all origins in development to support iframe/tunneling
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}