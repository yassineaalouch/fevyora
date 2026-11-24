import { StarMark } from "@/components/icons/BrandIcons";

type LogoProps = {
  tone?: "dark" | "light";
  size?: "lg" | "md" | "sm";
};

export function Logo({ tone = "dark", size = "md" }: LogoProps) {
  const color = tone === "light" ? "text-ivory" : "text-ink";
  const word = {
    sm: "text-[1.2rem] tracking-[0.2em]",
    md: "text-[1.45rem] tracking-[0.22em] sm:text-[1.65rem]",
    lg: "text-[1.7rem] tracking-[0.22em] sm:text-[1.9rem] sm:tracking-[0.26em] lg:text-[2.15rem] lg:tracking-[0.28em]",
  }[size];
  const star = size === "lg" ? "mb-1 h-3.5 w-3.5" : "mb-1 h-2.5 w-2.5";
  const tag =
    size === "lg"
      ? "mt-1.5 text-[8px] tracking-[0.42em] sm:text-[9px] sm:tracking-[0.48em]"
      : "mt-1 text-[8px] tracking-[0.38em] sm:text-[9px]";

  return (
    <span className={`inline-flex flex-col items-center leading-none ${color}`}>
      <StarMark className={star} />
      <span className={`font-serif font-medium uppercase ${word}`}>FEVYORA</span>
      <span className={`font-medium uppercase ${tag}`}>More than fashion</span>
    </span>
  );
}
