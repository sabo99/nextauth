"use client";

import React from "react";
import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/user-current-role";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
  children?: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  return role !== allowedRole ? (
    <FormError message="You do not have permission to use this role" />
  ) : (
    children
  );
};
