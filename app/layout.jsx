import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import HydrateMenu from "@/components/hydration/hydrate-menu";
import HydrateOrders from "@/components/hydration/hydrate-orders";
import { Toaster } from "sonner";
import SessionClientProvider from "@/providers/session-provider";
import ErrorBoundary from "@/components/shared/error-boundary";

export const metadata = {
  title: "Restaurant POS System",
  description:
    "Modern Point of Sale system for restaurants with menu management, order processing, and real-time analytics",
  keywords:
    "restaurant, POS, point of sale, menu management, order processing, restaurant management",
  authors: [{ name: "Restaurant POS Team" }],
  creator: "Restaurant POS System",
  publisher: "Restaurant POS System",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Restaurant POS System",
    description:
      "Modern Point of Sale system for restaurants with menu management, order processing, and real-time analytics",
    url: "http://localhost:3000",
    siteName: "Restaurant POS System",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Restaurant POS System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant POS System",
    description:
      "Modern Point of Sale system for restaurants with menu management, order processing, and real-time analytics",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "application-name": "Restaurant POS System",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Restaurant POS",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#2563eb",
    "msapplication-tap-highlight": "no",
    "theme-color": "#2563eb",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/placeholder-logo.png" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <ErrorBoundary>
          <SessionClientProvider>
            <QueryProvider>
              <HydrateMenu />
              <HydrateOrders />
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </SessionClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
};

export default RootLayout;
