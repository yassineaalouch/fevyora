import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import {
  CibMark,
  MastercardMark,
  SocialIcon,
  VisaMark,
} from "@/components/icons/BrandIcons";
import { LanguageSelect } from "@/components/layout/LanguageSelect";
import { Container } from "@/components/ui/Container";
import { footerLinks, socialLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-burgundy text-ivory">
      <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Link href="/" aria-label="FEVYORA, accueil">
            <Logo tone="light" />
          </Link>
        </div>

        <div>
          <p className="font-serif text-xl">Liens utiles</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-serif text-xl">Suivez-nous</p>
          <ul className="mt-4 flex gap-2.5">
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-ivory transition hover:bg-white/10"
                >
                  <SocialIcon name={item.icon} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-serif text-xl">Paiement sécurisé</p>
          <ul className="mt-4 flex flex-wrap items-center gap-2">
            <li>
              <span className="sr-only">Visa</span>
              <VisaMark />
            </li>
            <li>
              <span className="sr-only">Mastercard</span>
              <MastercardMark />
            </li>
            <li>
              <span className="sr-only">CIB</span>
              <CibMark />
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col items-center gap-4 py-5 text-sm text-ivory/75 sm:flex-row sm:justify-between">
          <p>© 2026 FEVYORA. Tous droits réservés.</p>
          <span className="hidden h-1.5 w-1.5 rotate-45 bg-ivory/70 sm:block" aria-hidden="true" />
          <LanguageSelect />
        </Container>
      </div>
    </footer>
  );
}
