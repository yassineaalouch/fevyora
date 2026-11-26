import type { Metadata } from "next";
import { AccountHome } from "@/components/account/AccountHome";

export const metadata: Metadata = {
  title: "Compte",
  description: "Espace client FEVYORA.",
};

export default function AccountPage() {
  return <AccountHome />;
}
