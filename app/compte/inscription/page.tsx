import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = { title: "Inscription" };

export default function SignupPage() {
  return (
    <AccountSection title="Inscription">
      <AuthForm mode="signup" />
    </AccountSection>
  );
}
