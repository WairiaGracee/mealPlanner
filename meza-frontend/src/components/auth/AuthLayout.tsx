import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import BackgroundSlideshow from "../landing/BackgroundSlideshow";
import { heroImages } from "../../data/heroImages";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Branding panel — reuses the same slideshow as the hero, hidden on
          small screens where there isn't room for it */}
      <div className="relative hidden overflow-hidden md:block">
        <BackgroundSlideshow images={heroImages} intervalMs={7000} variant="fade" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/">
            <Logo className="h-12 w-auto" />
          </Link>
          <div>
            <p className="font-display text-3xl leading-snug text-cream md:text-4xl">
              Eat like home,
              <br />
              <span className="text-gold">planned like a pro.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-cream/70">
              Weekly Kenyan meal plans tailored to your body, your goals, and
              your health.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16">
        <Link to="/" className="mb-10 inline-block md:hidden">
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl text-cream">{title}</h1>
          <p className="mt-2 text-sm text-cream/60">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-sm text-cream/60">{footer}</div>
        </div>
      </div>
    </div>
  );
}