import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang='en'>
      <section>{children}</section>
    </main>
  );
}
