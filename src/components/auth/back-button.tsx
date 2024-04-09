"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
  hidden?: boolean;
}

export const BackButton = ({ href, label, hidden }: BackButtonProps) => {
  return (
    !hidden && (
      <Button variant="link" className="font-normal w-full" size="sm" asChild>
        <Link href={href}>{label}</Link>
      </Button>
    )
  );
};
