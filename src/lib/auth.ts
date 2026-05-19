import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";

const ROLE_STAFF = "Staff Requester";
const ROLE_ADMIN = "ICT Admin";

/**
 * Map Microsoft 365 security group display names to application roles.
 * Group membership is read from the Entra ID token `groups` claim.
 * Configure these group Object IDs in your Entra ID app registration
 * under Token configuration → Add groups claim.
 */
const GROUP_ROLE_MAP: Record<string, string> = {
  "Nowtravels-Helpdesk-ICT-Admins": ROLE_ADMIN,
  "Nowtravels-Helpdesk-ICT-Supervisors": "ICT Supervisor",
  "Nowtravels-Helpdesk-ICT-Agents": "ICT Agent",
  "Nowtravels-Helpdesk-Branch-Managers": "Branch Manager",
  "Nowtravels-Helpdesk-Auditors": "Auditor",
  "Nowtravels-Helpdesk-Staff": ROLE_STAFF,
};

async function getOrCreateRole(name: string): Promise<string> {
  let role = await prisma.role.findFirst({ where: { name } });
  if (!role) {
    role = await prisma.role.create({ data: { name } });
  }
  return role.id;
}

async function syncUserToDb(
  entraId: string,
  email: string,
  fullName: string,
  roleName: string,
): Promise<{ id: string; roleName: string }> {
  const roleId = await getOrCreateRole(roleName);

  const existing = await prisma.user.findFirst({
    where: { OR: [{ entraId }, { email }] },
    include: { role: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        entraId: existing.entraId ?? entraId,
        fullName,
        lastLoginAt: new Date(),
      },
    });
    return { id: existing.id, roleName: existing.role.name };
  }

  const created = await prisma.user.create({
    data: { entraId, fullName, email, roleId },
    include: { role: true },
  });
  return { id: created.id, roleName: created.role.name };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email) return false;
      try {
        // Determine role from Entra group membership if available
        const groups: string[] =
          (profile as Record<string, unknown>)?.groups as string[] ?? [];
        let roleName = ROLE_STAFF;
        for (const [groupName, mapped] of Object.entries(GROUP_ROLE_MAP)) {
          if (groups.includes(groupName)) {
            roleName = mapped;
            break;
          }
        }

        const entraId =
          ((profile as Record<string, unknown>)?.oid as string) ??
          ((profile as Record<string, unknown>)?.sub as string) ??
          user.email;

        const { id, roleName: resolvedRole } = await syncUserToDb(
          entraId,
          user.email,
          user.name ?? user.email,
          roleName,
        );

        (user as Record<string, unknown>).dbId = id;
        (user as Record<string, unknown>).roleName = resolvedRole;
        return true;
      } catch (err) {
        console.error("[auth] signIn error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as Record<string, unknown>).dbId as string;
        token.role = (user as Record<string, unknown>).roleName as string;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        (session.user as Record<string, unknown>).id = token.userId;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
});
