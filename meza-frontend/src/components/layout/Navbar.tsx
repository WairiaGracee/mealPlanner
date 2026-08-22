import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import SideNav from "./SideNav";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll(); // set initial state in case page loads mid-scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        id="top"
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-300 ${
          isScrolled
            ? "bg-offwhite/95 py-4 shadow-md backdrop-blur-sm rounded-b-xl"
            : "bg-transparent py-6 shadow-none"
        }`}
      >
        <a     
          href="/"
          aria-label="IntentionallyWell home"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 font-robotoCondensed text-sm uppercase tracking-[0.15em] text-ink/70 lg:flex">
          <button onClick={() => navigate("/")} className="transition-colors hover:text-forest">
            HOME
          </button>
          <button onClick={() => navigate("/about")} className="transition-colors hover:text-forest">
            ABOUT
          </button>
          <button onClick={() => navigate("/recipe-guide")} className="transition-colors hover:text-forest">
            RECIPES
          </button>
          <button onClick={() => navigate("/gather")} className="transition-colors hover:text-forest">
            GATHER
          </button>
          <a href="#blog" className="transition-colors hover:text-forest">
            BLOGS
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* spacer so fixed header doesn't overlap page content */}
      <div className="h-[88px] md:h-[104px]" />

      <SideNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}