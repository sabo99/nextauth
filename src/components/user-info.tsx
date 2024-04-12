import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "../../next-auth";

interface UserInfoProps {
  label: string;
  user?: ExtendedUser;
}

interface UserMap {
  label: string;
  value?: any;
  badgeVariant: any;
}

const UserInfo = ({ label, user }: UserInfoProps) => {
  const userMap: UserMap[] = [
    { label: "ID", value: user?.id, badgeVariant: "truncate" },
    { label: "Name", value: user?.name, badgeVariant: "truncate" },
    { label: "Email", value: user?.email, badgeVariant: "truncate" },
    { label: "Role", value: user?.role, badgeVariant: "truncate" },
    {
      label: "Two Factor Authentication",
      value: user?.isTwoFactorEnabled ? "ON" : "OFF",
      badgeVariant: user?.isTwoFactorEnabled ? "success" : "destructive",
    },
  ];

  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {userMap.map((data) => (
          <div
            key={data.label}
            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md"
          >
            <p className="text-sm font-medium">{data.label}</p>
            <Badge variant={data.badgeVariant}>{data.value}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserInfo;
