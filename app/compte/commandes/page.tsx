import type { Metadata } from "next";
import { AccountSection } from "@/components/account/AccountSection";
import { OrdersPanel } from "@/components/account/OrdersPanel";

export const metadata: Metadata = { title: "Mes commandes" };

export default function OrdersPage() {
  return (
    <AccountSection title="Mes commandes">
      <OrdersPanel />
    </AccountSection>
  );
}
