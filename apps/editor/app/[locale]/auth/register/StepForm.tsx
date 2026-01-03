"use client";

import { usePostHog } from "@mioto/analytics/client";
import { registerAction } from "@mioto/server/actions/register.action";
import * as React from "react";
import { latestLegalVersions } from "../../../../content/legal";
import { AccessForm } from "./AccessForm";
import { OrgConfigForm } from "./OrgConfigForm";
import { RegisterForm } from "./RegisterForm";
import { useRouter } from "../../../../i18n/routing";

type Props = { className?: string };

export const StepForm = ({ className }: Props) => {
  const [step, setStep] = React.useState(0);
  const posthog = usePostHog();

  const [registerData, setRegisterData] = React.useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    legal?: boolean;
    privacy?: boolean;
    terms?: boolean;
    newsletter?: boolean;
    accessCode?: string;
  }>({});

  const router = useRouter();

  const Steps = [
    <RegisterForm
      onSuccess={(values) => {
        setRegisterData({ ...registerData, ...values });
        setStep(2);
      }}
      className={className}
      key="register-form"
    />,
    <OrgConfigForm
      key="org-config-form"
      className={className}
      onSuccess={async ({ orgName, orgSlug }) => {
        if (
          !registerData.email ||
          !registerData.password ||
          !registerData.accessCode
        )
          return;

        const result = await registerAction({
          email: registerData.email,
          password: registerData.password,
          orgName,
          orgSlug,
          accessCode: registerData.accessCode,
          legal: latestLegalVersions,
          newsletter: registerData.newsletter,
        });

        if (!result.success) return;

        posthog?.alias(result.data.uuid, result.data.email);

        router.push(`/org/${result.data.orgSlug}/dashboard`);
      }}
    />,
  ];

  return Steps[step];
};
