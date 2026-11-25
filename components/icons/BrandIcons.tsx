type IconProps = {
  className?: string;
};

export function StarMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.2 13.35 10.65 22.8 12 13.35 13.35 12 22.8 10.65 13.35 1.2 12 10.65 10.65Z"
      />
    </svg>
  );
}

export function HangerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 9.5a4.2 4.2 0 0 1 2.2 7.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M34.2 17.2 54.5 32.2c1.3.9.6 2.9-.9 2.9H10.4c-1.5 0-2.2-2-.9-2.9L29.8 17.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 35.1h39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FlowerArt({ className }: IconProps) {
  return (
    <svg viewBox="0 0 220 320" fill="none" className={className} aria-hidden="true">
      <path
        d="M78 308c18-48 16-92 34-128 10-20 28-34 42-58"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M112 180c-28 6-48 28-52 52 22-6 40-8 52-8"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M126 150c26 8 42 2 62-16-18 20-34 28-62 28"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M148 92c8-28 28-42 52-48-22 18-36 34-40 58 6-2 12-6 16-10"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M154 86c18 6 28 22 30 40-14-8-24-20-30-40Z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M142 78c-2-24 12-42 34-54"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M168 46c10 8 14 20 12 32"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M186 58c12-2 22 6 26 16"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 6.2c.7 2.2 2.2 3.6 4.4 4v2.4c-1.5 0-2.9-.5-4.1-1.3v5.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.6a2.9 2.9 0 1 0 2 2.8V4.8H14v1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.8" y="6" width="18.4" height="12" rx="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.4 9.4v5.2L15.2 12l-4.8-2.6Z" fill="currentColor" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.6 17.6c.3-1.1.7-2.3.9-3.4-.6-.9-.8-2-.5-3 .4-1.2 1.6-1.8 2.7-1.3 1.2.5 1.8 1.8 1.5 3.2-.2 1.3-1.2 2.2-2.3 2.2-.5 0-1-.2-1.2-.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const socialIcons = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  pinterest: PinterestIcon,
} as const;

export function SocialIcon({
  name,
  className,
}: {
  name: keyof typeof socialIcons;
  className?: string;
}) {
  const Icon = socialIcons[name];
  return <Icon className={className} />;
}

