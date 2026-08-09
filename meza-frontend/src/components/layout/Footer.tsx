import Button from "../ui/Button";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 px-6 py-10 md:px-12">
      <div className="mb-10 border bg-muted flex flex-col items-start justify-between gap-6 border-gold/15 p-10 md:flex-row md:items-end w-11/12 rounded-xl mx-auto">
              <div>
                <h2 className="font-display text-3xl leading-tight text-textLight md:text-4xl">
                  Start Your <span className="text-clay">Wellness</span>
                  <br />
                  Journey Today
                </h2>
              </div>
              <button className="py-3 px-10 bg-clay rounded-3xl text-textLight" >Register</button>
      </div>

      <div className="flex flex-col border-t border-gold rounded-t-lg pt-3 px-2 gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <span className="font-robotoCondensed">Nyeri, Kenya</span>
        <span className="font-robotoCondensed">New plans generated every Week</span>
        <span className="font-robotoCondensed">© {new Date().getFullYear()} IntentionallyWell</span>
      </div>
    </footer>
  );
}