import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-forest-deep px-6 py-16 text-offwhite md:px-12">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-offwhite/15 pb-12 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">
            Start Your <span className="italic text-gold">Wellness</span>
            <br />
            Journey Today
          </h2>
        </div>
        <Button
          variant="primary"
          className="bg-gold text-forest-deep hover:bg-offwhite"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>

      <div className="flex flex-col gap-4 font-robotoCondensed text-sm text-offwhite/70 md:flex-row md:items-center md:justify-between">
        <span>Nyeri, Kenya</span>
        <span>New plans generated every week</span>
        <span>© {new Date().getFullYear()} IntentionallyWell</span>
      </div>
    </footer>
  );
}