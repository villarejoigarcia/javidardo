import type { Metadata } from "next";
import { client } from "../sanity/client";
import "./globals.css";

const METADATA_QUERY = `*[_type == "settings"][0]{
  seo{
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url
  }
}`

export const metadata: Metadata = {
  title: "Javi Dardo",
  description: "Fashion and still life photographer based in Barcelona and working worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
