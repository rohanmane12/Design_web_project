import './globals.css';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  
  return (
    <html lang={locale || 'en'} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
