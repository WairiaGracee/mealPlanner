import { readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const FOLDERS = ["public/hero", "public/meal-plans", "public/menu"];
const MAX_WIDTH = 1600;

async function optimise(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const before = (await stat(file)).size;
  const tmp = `${file}.tmp`;
  let image = sharp(file).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  image =
    ext === ".png"
      ? image.png({ palette: true, quality: 80, compressionLevel: 9 })
      : image.jpeg({ quality: 75, mozjpeg: true });
  await image.toFile(tmp);

  const after = (await stat(tmp)).size;
  if (after < before) {
    await unlink(file);
    await rename(tmp, file);
    console.log(`${file}: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(2)} MB`);
  } else {
    await unlink(tmp);
  }
}

for (const folder of FOLDERS) {
  for (const name of await readdir(folder)) {
    await optimise(path.join(folder, name));
  }
}