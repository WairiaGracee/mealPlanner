import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Meals", href: "#dishes" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Blog", href: "#blog" },
  { label: "Reviews", href: "#reviews" },
];

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-forest-deep"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        <Logo className="h-16 w-auto sm:h-18 brightness-0 invert" />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center text-2xl text-offwhite transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          ×
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-6 md:px-12">
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group flex items-baseline gap-4 border-b border-offwhite/10 py-4 font-display text-4xl text-offwhite/90 transition-colors hover:text-gold md:text-5xl"
          >
            <span className="font-mono text-xs text-gold">0{i + 1}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-3 border-t border-offwhite/10 px-6 py-6 sm:hidden">
        <Button
          variant="outline"
          className="w-full justify-center border-offwhite/40 text-offwhite hover:border-offwhite hover:text-offwhite"
          onClick={() => {
            onClose();
            navigate("/login");
          }}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          className="w-full justify-center bg-gold text-forest-deep hover:bg-offwhite"
          onClick={() => {
            onClose();
            navigate("/register");
          }}
        >
          Get started
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-t border-offwhite/10 px-6 py-6 text-sm text-offwhite/60 md:flex-row md:items-center md:justify-between md:px-12">
        <span>Nairobi · Mombasa · Kisumu</span>
        <span>New plans every Sunday</span>
      </div>
    </div>
  );
}