import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nico Garay — Consultant Digital & Créateur de Sites et Apps",
  description:
    "Senior Digital & IT Consultant avec +5 ans d'expérience. Je crée des sites vitrine, des applications web et vous accompagne dans votre transformation digitale.",
  keywords: [
    "consultant digital",
    "création site internet",
    "développement application",
    "project manager",
    "freelance",
    "France",
  ],
  authors: [{ name: "Nico Garay" }],
  openGraph: {
    title: "Nico Garay — Consultant Digital & Créateur Web",
    description:
      "Du brief au live — je pilote, je build, je délivre.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
