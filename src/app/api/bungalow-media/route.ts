import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const publicDirectory = path.join(process.cwd(), "public");
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
] as const;

type MediaType = "image" | "video";

function toMediaItem(folder: string, fileName: string, type: MediaType) {
  return {
    src: `/images/pics/${folder}/${fileName}`,
    type,
  };
}

async function readFolderMedia(folder: string) {
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

export async function GET() {
  const bungalows = await Promise.all(
    folders.map(async ({ folder, id }) => {
      const { images, videos } = await readFolderMedia(folder);
      const media = [...videos, ...images];

      return { id, media };
    }),
  );

  return NextResponse.json({ bungalows });
}
