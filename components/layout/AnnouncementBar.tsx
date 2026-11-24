import { Heart, Truck } from "lucide-react";
import { StarMark } from "@/components/icons/BrandIcons";

export function AnnouncementBar() {
  return (
    <div className="bg-burgundy text-ivory">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[11px] sm:gap-x-4 sm:text-xs">
        <p className="inline-flex items-center gap-2">
          <Truck className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          Livraison partout au Maroc
        </p>
        <StarMark className="hidden h-2 w-2 sm:block" />
        <p className="inline-flex items-center gap-2">
          <Heart className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
          Paiement à la livraison
        </p>
      </div>
    </div>
  );
}
