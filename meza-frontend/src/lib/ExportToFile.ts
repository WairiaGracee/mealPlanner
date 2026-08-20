import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

/**
 * Both export paths start the same way: rasterize an off-screen,
 * purpose-built "export card" node (not a screenshot of the live page —
 * see the ExportCard components) into a PNG data URL at 2x pixel
 * density so it stays crisp on retina screens and when printed.
 */
// Any <img> inside the export card (e.g. a recipe photo) loads
// asynchronously. If toPng() rasterizes before it finishes, that image
// comes out blank in the capture. Wait for every image to either load
// or fail before handing the node to html-to-image.
async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    })
  );
}

async function captureNode(node: HTMLElement): Promise<{ dataUrl: string; width: number; height: number }> {
  await waitForImages(node);
  // pixelRatio: 2 for crispness. backgroundColor: "#ffffff" because the
  // export cards are transparent-background by default and PNGs/PDFs
  // should never have a see-through card floating on nothing.
  const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#ffffff" });
  return { dataUrl, width: node.offsetWidth, height: node.offsetHeight };
}

export async function exportNodeAsImage(node: HTMLElement, filename: string): Promise<void> {
  const { dataUrl } = await captureNode(node);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.click();
}

export async function exportNodeAsPdf(node: HTMLElement, filename: string): Promise<void> {
  const { dataUrl, width, height } = await captureNode(node);

  // Custom page size matching the card's own pixel dimensions (unit:
  // "px") rather than forcing it into an A4 page — this is a flyer-style
  // export, not a multi-page document, so nothing should get cropped or
  // stretched to fit a standard paper size.
  const pdf = new jsPDF({
    orientation: height >= width ? "portrait" : "landscape",
    unit: "px",
    format: [width, height],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}