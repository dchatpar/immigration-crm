"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "next-auth/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl && convexUrl.startsWith("http") ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SessionProvider>
            {convex ? (
                <ConvexProvider client={convex}>{children}</ConvexProvider>
            ) : (
                <>{children}</>
            )}
        </SessionProvider>
    );
}
