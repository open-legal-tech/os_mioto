import Heading from "@mioto/design-system/Heading";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { getTranslations } from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { AGBFileDropzone } from "../../../settings/AGBFileUpload/AGBFileUpload";
import { BackgroundFileUpload } from "../../../settings/BackgroundFileUpload/BackgorundFileUpload";
import { LogoFileUpload } from "../../../settings/LogoFileUpload/LogoFileUpload";
import { PrivacyFileDropzone } from "../../../settings/PrivacyFileUpload/PrivacyFileUpload";
import { ThemeMenu } from "../../../shared/ThemeEditor/ThemeMenu";
import { ThemeSelector } from "../../../shared/ThemeEditor/ThemeSelector";

export async function ClientPortalSettings({ locale }: { locale: string }) {
  const { db, user } = await getCurrentEmployee();
  const t = await getTranslations({ locale });

  const organisationConfig = await db.organization.findUnique({
    where: {
      uuid: user.organizationUuid,
    },
    select: {
      Themes: {
        select: {
          name: true,
          uuid: true,
        },
      },
      Theme: {
        select: {
          name: true,
          uuid: true,
        },
      },
      ClientPortal: {
        select: {
          termsUrl: true,
          Terms: {
            select: {
              fileUuid: true,
              File: {
                select: {
                  displayName: true,
                },
              },
            },
          },
          privacyUrl: true,
          Privacy: {
            select: {
              fileUuid: true,
              File: {
                select: {
                  displayName: true,
                },
              },
            },
          },
          organizationUuid: true,
          Logo: {
            select: {
              fileUuid: true,
              File: {
                select: {
                  displayName: true,
                },
              },
            },
          },
          Background: {
            select: {
              fileUuid: true,
              File: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const themeOptions =
    organisationConfig?.Themes.map(
      (theme) =>
        (({
          name: theme.name,
          id: theme.uuid,
          type: "option",
          data: undefined
        }) as const),
    ) ?? [];

  return (
    <Stack className="flex flex-col gap-8 h-full overflow-y-auto">
      <Stack className="gap-4">
        <Heading size="small">
          {t("app.settings.client-portal.legal-documents.title")}
        </Heading>
        <div
          className="grid gap-3 items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          <AGBFileDropzone
            existingAGB={
              organisationConfig?.ClientPortal?.Terms ||
              organisationConfig?.ClientPortal?.termsUrl
                ? {
                    name: organisationConfig?.ClientPortal?.Terms?.File
                      .displayName,
                    uuid: organisationConfig?.ClientPortal?.Terms?.fileUuid,
                    url: organisationConfig?.ClientPortal?.termsUrl,
                  }
                : undefined
            }
          />
          <PrivacyFileDropzone
            existingPrivacy={
              organisationConfig?.ClientPortal?.Privacy ||
              organisationConfig?.ClientPortal?.privacyUrl
                ? {
                    name: organisationConfig?.ClientPortal?.Privacy?.File
                      .displayName,
                    uuid: organisationConfig?.ClientPortal?.Privacy?.fileUuid,
                    url: organisationConfig?.ClientPortal?.privacyUrl,
                  }
                : undefined
            }
          />
        </div>
      </Stack>
      <Stack className="gap-4 mb-4">
        <Heading size="small">
          {t("app.settings.client-portal.theming.title")}
        </Heading>
        <Stack className="gap-3">
          <Row className="gap-1">
            <ThemeSelector
              options={themeOptions}
              selectedTheme={organisationConfig?.Theme?.uuid ?? ""}
              className="items-center gap-2 flex"
            />
            <ThemeMenu options={themeOptions} />
          </Row>
          <div
            className="grid gap-3 items-start"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            <LogoFileUpload
              existingLogo={
                organisationConfig?.ClientPortal?.Logo
                  ? {
                      name: organisationConfig.ClientPortal.Logo.File
                        .displayName,
                      uuid: organisationConfig.ClientPortal.Logo.fileUuid,
                    }
                  : undefined
              }
            />
            <BackgroundFileUpload
              existingBackground={
                organisationConfig?.ClientPortal?.Background
                  ? {
                      name: organisationConfig.ClientPortal.Background.File
                        .displayName,
                      uuid: organisationConfig.ClientPortal.Background.fileUuid,
                    }
                  : undefined
              }
            />
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
}
