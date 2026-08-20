import { useEffect, useRef, useState } from "react";
import { IconChevronDown, IconDownload } from "../dashboard/icons";
import { exportNodeAsImage, exportNodeAsPdf } from "../../lib/ExportToFile";

interface ExportMenuProps {
  /** Ref to the off-screen export card to capture — see ExportCard components. */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Filename without extension. */
  filename: string;
  /** Small variant for tight spaces like a recipe card corner. */
  compact?: boolean;
  /**
   * Called synchronously (wrap the state update in flushSync from the
   * caller) right when the button is pressed, before the menu opens.
   * Needed on pages like RecipesPage where many cards share a single
   * off-screen export node — this is the hook that swaps which item's
   * data that shared node is currently showing, before anything reads
   * targetRef.current.
   */
  onBeforeOpen?: () => void;
}

export default function ExportMenu({
  targetRef,
  filename,
  compact = false,
  onBeforeOpen,
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleExport(kind: "image" | "pdf") {
    const node = targetRef.current;
    if (!node) return;
    setBusy(true);
    setError(null);
    setOpen(false);
    try {
      if (kind === "image") {
        await exportNodeAsImage(node, filename);
      } else {
        await exportNodeAsPdf(node, filename);
      }
    } catch {
      setError("Couldn't create that file. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => {
          onBeforeOpen?.();
          setOpen((prev) => !prev);
        }}
        disabled={busy}
        className={
          compact
            ? "flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-forest-light disabled:opacity-60"
            : "flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-forest-light disabled:opacity-60"
        }
        title="Export"
      >
        <IconDownload className={compact ? "h-4 w-4" : "h-4 w-4"} />
        {!compact && (busy ? "Exporting…" : "Export")}
        {!compact && <IconChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-paper shadow-lg">
          <button
            onClick={() => handleExport("image")}
            className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-forest-light"
          >
            Download as Image
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-forest-light"
          >
            Download as PDF
          </button>
        </div>
      )}

      {error && (
        <p className="absolute right-0 mt-1 w-48 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}