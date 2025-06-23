// app/(auth)/layout.jsx
'use client';

import "@/styles/globals.css";

import { UserProvider } from '@/context/user_context';
import LayoutWrapper from "@/components/layout/layout-wrapper";


export default function AuthLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </UserProvider>
            </body>
        </html>
    );
}
