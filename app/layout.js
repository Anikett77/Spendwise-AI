import "./globals.css";

export const metadata = {
  title: "SpendWise AI — Free AI Tool Spend Audit",
  description: "Find out exactly where you are overspending on AI tools. Get instant recommendations and see your potential monthly savings.",
  openGraph: {
    title: "SpendWise AI — Free AI Tool Spend Audit",
    description: "Stop overpaying for AI tools. Get your free audit in 2 minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
