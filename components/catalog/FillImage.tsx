import Image from "next/image";

export function FillImage({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  if (!src) return <span className="absolute inset-0 bg-beige" />;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} />;
}
