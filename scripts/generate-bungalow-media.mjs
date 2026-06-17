import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const publicDirectory = path.join(process.cwd(), "public");
const outputPath = path.join(publicDirectory, "bungalow-media.json");
const imageExtensions = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);
const videoExtensions = new Set([".mp4", ".mov", ".webm"]);
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const folders = [
  { id: "dune", folder: "bungalow1" },
  { id: "kopje", folder: "bungalow2" },
  { id: "horizon", folder: "bungalow3" },
];

function toMediaItem(folder, fileName, type) {
  return {
    src: `/images/pics/${folder}/${fileName}`,
    type,
  };
}

async function readFolderMedia(folder) {
  const files = await readdir(path.join(publicDirectory, "images", "pics", folder));
  const sortedFiles = files.sort((a, b) => collator.compare(a, b));

  return {
    images: sortedFiles
      .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
      .map((fileName) => toMediaItem(folder, fileName, "image")),
    videos: sortedFiles
      .filter((fileName) => videoExtensions.has(path.extname(fileName).toLowerCase()))
      .map((fileName) => toMediaItem(folder, fileName, "video")),
  };
}

const bungalows = await Promise.all(
  folders.map(async ({ folder, id }) => {
    const { images, videos } = await readFolderMedia(folder);

    return { id, media: [...videos, ...images] };
  }),
);

await writeFile(
  outputPath,
  `${JSON.stringify({ bungalows }, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
