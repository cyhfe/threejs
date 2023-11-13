"use client";

import Link from "next/link";

export default function Home() {
  const links = [
    { href: "/demo1", label: "demo1" },
    { href: "/demo2", label: "demo2" },
  ];

  return (
    <div>
      <div>
        {links.map((link) => {
          return (
            <div key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
