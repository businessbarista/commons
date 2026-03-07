import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Commons — The Trusted AI Skills Directory",
    template: "%s — Commons",
  },
  description:
    "The most trusted library of human-verified AI skills. Discover, copy, and rate curated .md skills that actually work.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://commons.dev",
  ),
  openGraph: {
    title: "Commons — The Trusted AI Skills Directory",
    description:
      "Discover, copy, and rate curated AI skills that actually work.",
    type: "website",
    siteName: "Commons",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commons — The Trusted AI Skills Directory",
    description:
      "Discover, copy, and rate curated AI skills that actually work.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('commons-theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
