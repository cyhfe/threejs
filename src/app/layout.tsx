import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { href: "/notes", label: "notes" },
    { href: "/basic", label: "basic" },
    { href: "/gltf", label: "gltf" },
    { href: "/dominos", label: "dominos" },
  ];
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " h-full"}>
        <div className="flex h-full ">
          <div className="bg-gray-200 w-44 shrink-0	p-4 fixed top-0 bottom-0">
            {links.map((link) => {
              return (
                <div key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </div>
              );
            })}
          </div>
          <div className="w-full h-full ml-44">{children}</div>
        </div>
      </body>
    </html>
  );
}
