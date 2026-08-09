import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import SideNav from "./SideNav";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header
        id="top"
        className="relative z-40 flex items-center justify-between px-6 py-6 md:px-12"
      >
        <a href="#top" aria-label="Meza home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.15em] text-cream/80 lg:flex">
          <a href="#dishes" className="transition-colors hover:text-gold">
            Meals
          </a>
          <span className="text-clay">◇</span>
          <a href="#how-it-works" className="transition-colors hover:text-gold">
            How it works
          </a>
          <span className="text-clay">◇</span>
          <a href="#blog" className="transition-colors hover:text-gold">
            Blog
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button
            variant="primary"
            className="px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm"
            onClick={() => navigate("/register")}
          >
            Get started
          </Button>
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <span className="h-px w-5 bg-cream" />
            <span className="h-px w-5 bg-cream" />
          </button>
        </div>
      </header>

      <SideNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}