import React from "react";

interface EmailTemplateProps {
  title: string;
  label: string;
  href: string;
  email: string;
}

export const EmailTemplate = ({
  title,
  label,
  href,
  email,
}: EmailTemplateProps) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="rounded-xl border bg-card text-card-foreground w-[400px] shadow-md">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="w-full flex flex-col gap-y-4 items-center justify-center text-center">
            <h1 className="text-3xl font-semibold __className_12c8de">
              🔐{title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Click the button below to verify your email. [{email}]
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <a
            href={href}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
          >
            {label}
          </a>
        </div>
      </div>
    </div>
  );
};
