import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.department = user.department
                token.avatar = user.avatar
                token.isActive = user.isActive
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.department = token.department as string
                session.user.avatar = token.avatar as string
                session.user.isActive = token.isActive as boolean
            }
            return session
        }
    },
    providers: [], // Configured in auth.ts
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig
