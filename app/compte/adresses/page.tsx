import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { AddressPanel } from "@/components/account/AddressPanel";

export const metadata: Metadata = { title: "Mes adresses" };

export default function AddressesPage() {
  return (
    <AccountSection title="Mes adresses">
      <AddressPanel />
    </AccountSection>
  );
}
