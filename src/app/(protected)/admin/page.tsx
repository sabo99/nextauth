"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const actions = [
  {
    title: "Admin-only API Route",
    button: {
      label: "Click to test",
      onClick: () => {
        fetch("/api/admin").then((res) => {
          if (res.ok) {
            toast.success("Allowed API Route!");
          } else {
            toast.error("Forbidden API Route!");
          }
        });
      },
    },
  },
  {
    title: "Admin-only Server Action",
    button: {
      label: "Click to test",
      onClick: () => {
        admin().then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        });
      },
    },
  },
];

const AdminPage = () => {
  return (
    <Card className="rounded-xl w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed this content" />
        </RoleGate>
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between rounded-lg boder p-3 shadow-md"
          >
            <p className="text-sm font-medium">{action.title}</p>
            <Button onClick={action.button.onClick}>
              {action.button.label}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminPage;
