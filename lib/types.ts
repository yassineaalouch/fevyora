export type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
};

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  collection: string;
  image: string;
  imageAlt: string;
  detail: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  popularity?: number;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: [string, string];
  script: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  mobileImage: string;
  imageAlt: string;
  position: string;
  mobilePosition: string;
};

export type Benefit = {
  title: string;
  text: string;
  icon: "gem" | "truck" | "shield" | "headset";
};
