import "@/styles/global.css";
import type { Metadata, Viewport } from "next";

const siteName = "Mt.Otjiku Getaway";
const siteDescription =
  "A futuristic luxury bungalow accommodation on Namibia's savannah plains, set near Otjiku in Otjozondjupa.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "http://localhost:3000";
const heroImage =
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  image: heroImage,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Otjiku",
    addressRegion: "Otjozondjupa",
    addressCountry: "NA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -21.19305,
    longitude: 16.88219,
  },
  priceRange: "$$$$",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteName} | Luxury Savannah Bungalows in Namibia`,
  description: siteDescription,
  manifest: "/manifest.json",
  applicationName: siteName,
  keywords: [
    "Namibia luxury lodge",
    "savannah bungalow",
    "Otjiku accommodation",
    "luxury safari Namibia",
    "Mt.Otjiku Getaway",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: `${siteName} | Luxury Savannah Bungalows in Namibia`,
    description: siteDescription,
    images: [
      {
        url: heroImage,
        width: 1920,
        height: 1080,
        alt: "Namibian savannah at golden hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Luxury Savannah Bungalows in Namibia`,
    description: siteDescription,
    images: [heroImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0C0A",
  colorScheme: "dark",
};

function serializeStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeStructuredData(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
}
