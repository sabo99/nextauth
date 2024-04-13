"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";

interface Menu {
  url: string;
  label: string;
}

const menuList: Menu[] = [
  { url: "/server", label: "Server" },
  { url: "/client", label: "Client" },
  { url: "/admin", label: "Admin" },
  { url: "/settings", label: "Settings" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-md">
      <div className="flex gap-x-2">
        {menuList.map((menu: Menu, index: number) => (
          <Button
            key={index}
            variant={pathname === menu.url ? "default" : "outline"}
            asChild
          >
            <Link href={menu.url}>{menu.label}</Link>
          </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
