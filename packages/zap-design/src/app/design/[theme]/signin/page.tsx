'use client';

import { SignInTemplate } from "@/genesis/templates/login/SignInTemplate";
import { useDynamicTheme } from "../layout";

export default function SignInPage() {
    const { themeId } = useDynamicTheme();

    return (
        <div className="flex-1 w-full min-h-screen">
            <SignInTemplate />
        </div>
    );
}
