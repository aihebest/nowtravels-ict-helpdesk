import type { NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

/**
 * Edge-safe auth config used by middleware.
 * No Prisma / Node.js-only modules here.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_ENTRA_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_ENTRA_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_ENTRA_TENANT_ID!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isProtected =
        nextUrl.pathname.startsWith("/staff") || isAdminRoute;

      if (!isProtected) return true;
      if (!isLoggedIn) return false;

      // ICT Admin role required for /admin routes
      if (isAdminRoute) {
        const role = (auth.user as { role?: string }).role;
        if (role !== "ICT Admin") {
          return Response.redirect(new URL("/staff", nextUrl));
        }
      }
      return true;
    },
    jwt({ token }) {
      return token;
    },
    session({ session }) {
      return session;
    },
  },
};
