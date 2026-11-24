import type { Benefit, Collection, HeroSlide, NavLink, Product } from "@/lib/types";

function pageImage(filename: string) {
  return `/images/${encodeURIComponent("pages images")}/${encodeURIComponent(filename)}`;
}

/**
 * Visuels du dossier public/images/pages images.
 * Le nom de chaque fichier indique son emplacement.
 */
export const images = {
  hero: pageImage("home page hero section image.webp"),
  abayas: pageImage("home page nos collections image1.webp"),
  ensembles: pageImage("home page nos collections image2.webp"),
  jupes: pageImage("home page nos collections image3.webp"),
  manteaux: pageImage("home page nos collections image4.webp"),
  vision: pageImage("home page Une marque, une vision section image.webp"),
  boutiqueHero: pageImage("boutique page hero section image.webp"),
  boutiqueNewsletter: pageImage("boutique page Restez connect\u00e9c section image.webp"),
  fabric: pageImage("fabric.jpg"),
  productSage: pageImage("boutique prodact image 1.webp"),
  productRuffle: pageImage("boutique prodact image 2.webp"),
  productCoat: pageImage("boutique prodact image3.webp"),
} as const;

export const heroSlides: HeroSlide[] = [
  {
    id: "style",
    eyebrow: "FEVYORA",
    title: ["Modern Modest", "Style"],
    script: "for you",
    description:
      "Élégance, confort et confiance...\nDécouvrez notre nouvelle collection.",
    cta: "Découvrir la collection",
    href: "/collections",
    image: images.hero,
    mobileImage: images.hero,
    imageAlt:
      "Trois silhouettes modestes, bordeaux, ivoire et olive, dans une galerie d'arches",
    position: "center center",
    mobilePosition: "68% center",
  },
];

export const benefits: Benefit[] = [
  {
    title: "Qualité Premium",
    text: "Des tissus d'exception",
    icon: "gem",
  },
  {
    title: "Livraison Rapide",
    text: "Partout au Maroc",
    icon: "truck",
  },
  {
    title: "Paiement Sécurisé",
    text: "En toute confiance",
    icon: "shield",
  },
  {
    title: "Service Client",
    text: "Toujours à votre écoute",
    icon: "headset",
  },
];

export const collections: Collection[] = [
  {
    slug: "abayas-robes",
    name: "Abayas & Robes",
    description:
      "Des silhouettes longues et fluides, avec des détails contemporains : volants, tombés amples et finitions soignées.",
    image: images.abayas,
    imageAlt:
      "Femme en hijab noir, blouse bordeaux à volants et longue jupe noire sous une arche",
  },
  {
    slug: "ensembles",
    name: "Ensembles",
    description:
      "Vestes courtes, jupes volumineuses et harmonies de tons pour une allure complète, élégante sans effort.",
    image: images.ensembles,
    imageAlt:
      "Femme en hijab ivoire, veste courte boutonnée et longue jupe chocolat",
  },
  {
    slug: "jupes-tops",
    name: "Jupes & Tops",
    description:
      "Des volumes doux et des hauts raffinés, à porter ensemble ou à composer selon le moment.",
    image: images.jupes,
    imageAlt:
      "Femme en hijab olive, blouse olive et longue jupe ivoire avec ceinture chaîne",
  },
  {
    slug: "vestes-manteaux",
    name: "Vestes & Manteaux",
    description:
      "Des coupes nettes et des matières enveloppantes pour prolonger la saison avec caractère.",
    image: images.manteaux,
    imageAlt:
      "Femme en hijab noir portant un long manteau bordeaux sur une robe noire",
  },
];

export const catalogColors = [
  { id: "noir", label: "Noir", hex: "#2a2422" },
  { id: "ivoire", label: "Ivoire", hex: "#f4e7da" },
  { id: "bordeaux", label: "Bordeaux", hex: "#6e2434" },
  { id: "olive", label: "Olive", hex: "#6d7344" },
  { id: "chocolat", label: "Chocolat", hex: "#6b4632" },
  { id: "sauge", label: "Sauge", hex: "#8ea396" },
] as const;

export const catalogSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const products: Product[] = [
  {
    slug: "ensemble-elegant",
    name: "Ensemble Élégant",
    price: 499,
    compareAt: 699,
    badge: "Nouveau",
    rating: 5,
    reviews: 104,
    popularity: 100,
    collection: "ensembles",
    image: images.ensembles,
    imageAlt: "Veste ivoire à col festonné et jupe longue chocolat",
    detail: "Veste courte · jupe ample",
    sizes: ["S", "M", "L"],
    colors: ["ivoire", "chocolat"],
  },
  {
    slug: "robe-a-volants",
    name: "Robe à Volants",
    price: 599,
    compareAt: 799,
    badge: "Best Seller",
    rating: 5,
    reviews: 98,
    popularity: 99,
    collection: "abayas-robes",
    image: images.productRuffle,
    imageAlt: "Blouse bordeaux à volants et longue jupe noire",
    detail: "Volants · jupe longue",
    sizes: ["XS", "S", "M", "L"],
    colors: ["bordeaux", "noir"],
  },
  {
    slug: "ensemble-chic",
    name: "Ensemble Chic",
    price: 549,
    compareAt: 749,
    rating: 5,
    reviews: 76,
    popularity: 98,
    collection: "jupes-tops",
    image: images.jupes,
    imageAlt: "Top olive et jupe longue ivoire avec ceinture perlée",
    detail: "Top olive · jupe ivoire",
    sizes: ["S", "M", "L", "XL"],
    colors: ["olive", "ivoire"],
  },
  {
    slug: "jupe-longue-premium",
    name: "Jupe Longue Premium",
    price: 399,
    compareAt: 499,
    badge: "-20%",
    rating: 5,
    reviews: 62,
    popularity: 97,
    collection: "jupes-tops",
    image: images.productSage,
    imageAlt: "Veste noire croisée et jupe longue sauge",
    detail: "Jupe ample · veste croisée",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["noir", "sauge"],
  },
  {
    slug: "veste-courte",
    name: "Veste Courte",
    price: 449,
    compareAt: 599,
    rating: 5,
    reviews: 71,
    popularity: 96,
    collection: "ensembles",
    image: images.ensembles,
    imageAlt: "Veste courte ivoire à poches festonnées",
    detail: "Col festonné · boutons nacrés",
    sizes: ["XS", "S", "M"],
    colors: ["ivoire", "chocolat"],
  },
  {
    slug: "robe-longue-elegante",
    name: "Robe Longue Élégante",
    price: 479,
    compareAt: 599,
    badge: "-15%",
    rating: 5,
    reviews: 89,
    popularity: 95,
    collection: "vestes-manteaux",
    image: images.productCoat,
    imageAlt: "Long manteau bordeaux sur une robe noire",
    detail: "Manteau long · robe noire",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bordeaux", "noir"],
  },
];

export const boutiqueLinks: NavLink[] = [
  { href: "/boutique", label: "Nouveautés" },
  ...collections.map((collection) => ({
    href: `/collections/${collection.slug}`,
    label: collection.name,
  })),
];

export const collectionLinks: NavLink[] = [
  { href: "/collections", label: "Toutes les collections" },
  ...collections.map((collection) => ({
    href: `/collections/${collection.slug}`,
    label: collection.name,
  })),
];

export const mainNav: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique", children: boutiqueLinks },
  { href: "/collections", label: "Collections", children: collectionLinks },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/collections", label: "Collections" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" },
  { name: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
  { name: "Pinterest", href: "https://www.pinterest.com/", icon: "pinterest" },
] as const;

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((product) => product.collection === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function searchProducts(query: string) {
  const needle = query.trim().toLocaleLowerCase("fr");
  if (!needle) return products;
  return products.filter((product) => {
    const collection = getCollection(product.collection);
    const haystack = [product.name, product.detail, collection?.name ?? ""]
      .join(" ")
      .toLocaleLowerCase("fr");
    return haystack.includes(needle);
  });
}
