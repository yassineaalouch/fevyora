import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { ReferralPanel } from "@/components/account/ReferralPanel";

export const metadata: Metadata = { title: "Parrainage" };

export default function ReferralPage() {
  return (
    <AccountSection title="Parrainage">
      <ReferralPanel />
    </AccountSection>
  );
}
