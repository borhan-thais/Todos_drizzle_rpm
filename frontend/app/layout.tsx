export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}  {/* This is where your page.tsx content appears */}
      </body>
    </html>
  );
}