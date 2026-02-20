import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string
        role: string
        department?: string
        avatar?: string
        isActive: boolean
    }

    interface Session {
        user: {
            id: string
            role: string
            department?: string
            avatar?: string
            isActive: boolean
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        department?: string
        avatar?: string
        isActive: boolean
    }
}
