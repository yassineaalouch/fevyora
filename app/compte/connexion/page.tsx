import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <AccountSection title="Connexion">
      <AuthForm mode="login" />
    </AccountSection>
  );
}
