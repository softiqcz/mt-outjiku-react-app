const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function publicPath(path: string) {
  if (/^(https?:|data:|blob:)/.test(path) || !path.startsWith("/")) {
    return path;
  }

  return `${basePath}${path}`;
}
