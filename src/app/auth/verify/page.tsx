import React from "react";
import { EmailTemplate } from "@/components/email-template";

const AuthVerifyPage = () => {
  return (
    <div>
      <EmailTemplate
        title={"Title"}
        label={"Lavel"}
        href={"/ada"}
        email={"a@gmail.com"}
      />
    </div>
  );
};

export default AuthVerifyPage;
