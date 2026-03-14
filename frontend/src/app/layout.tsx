import type { Metadata, Viewport } from "next";
import Header from "./components/header";
import { client } from "@/sanity/client";
import "./globals.css";

const METADATA_QUERY = `*[_type == "metadata"][0]{
  siteTitle,
  description,
  "ogImage": ogImage.asset->url,
  "favicon": favicon.asset->url
}`;

export async function generateMetadata(): Promise<Metadata> { // genera la metadata en el server aunque ahora localhost aparezca como <div hidden> en producción se inserta en <head>
  const data = await client.fetch(METADATA_QUERY);
  const title = data?.siteTitle || "Javi Dardo";
  const description = data?.description || "";
  const ogImage = data?.ogImage;
  const favicon = data?.favicon;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    icons: {
      icon: [
        { url: favicon || "/favicon.ico" },
        { url: favicon || "/favicon.ico", sizes: "32x32" },
      ],
      apple: favicon || "/favicon.ico",
    },
    openGraph: {
      title: title,
      description,
      url: "https://javidardo.com", // no se si será esta la url definitiva
      siteName: title,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
