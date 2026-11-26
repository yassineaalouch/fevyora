import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { SettingsPanel } from "@/components/account/SettingsPanel";

export const metadata: Metadata = { title: "Paramètres" };

export default function SettingsPage() {
  return (
    <AccountSection title="Paramètres">
      <SettingsPanel />
    </AccountSection>
  );
}
