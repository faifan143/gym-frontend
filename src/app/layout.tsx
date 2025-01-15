import LayoutProviders from "@/components/providers/LayoutProviders";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutProviders>{children}</LayoutProviders>
      </body>
    </html>
  );
}
