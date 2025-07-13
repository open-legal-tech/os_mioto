import Heading from "@mioto/design-system/Heading";
import Text from "@mioto/design-system/Text";
import { generateMiotoMetadata } from "../../shared/generateMiotoMetadata";
import { Row } from "@mioto/design-system/Row";
import { ButtonLink } from "@mioto/design-system/Button";
import Logo from "@mioto/design-system/Logo";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: "Home",
}));

export default async function HomePage() {
  return (
    <div className="h-full flex items-center justify-center bg-tertiary1">
      <div className="max-w-[700px] flex items-center flex-col gap-4">
        <Logo className="w-[50px]" />
        <Heading className="font-serif" size="large">
          Mioto wird Open Source
        </Heading>
        <Text className="text-center text-balance">
          Von der Formularerstellung über die Dokumentenautomatisierung bis hin
          zur AI-Integration: Mioto Labs übergibt das Projekt Mioto an den Open
          Legal Tech e.V.Ihr möchtet mehr erfahren oder mitwirken? Dann besucht
          den Open Legal Tech e.V. für weitere Informationen.
        </Text>
        <div className="gap-2 grid grid-cols-2">
          <ButtonLink emphasize href="https://open-legal-tech.org/">
            Open Legal Tech e.V.
          </ButtonLink>
          <ButtonLink emphasize href="/auth/login" variant="secondary">
            Login
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
