export const metadata = {
  title: "LoveScriner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0f14" }}>
        {children}
      </body>
    </html>
  );
}
