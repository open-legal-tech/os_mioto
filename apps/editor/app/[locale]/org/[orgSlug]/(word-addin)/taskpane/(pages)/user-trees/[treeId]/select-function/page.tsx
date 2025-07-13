import { Button } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";

import { Stack } from "@mioto/design-system/Stack";
import { Info, Question, Textbox } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface SelectFunctionPageProps {
  params: Promise<{
    treeId: string;
  }>;
}

export default async function SelectFunctionPage(props: SelectFunctionPageProps) {
  const params = await props.params;

  const {
    treeId
  } = params;

  return (
    <Stack className="h-full justify-between">
      <Stack className="gap-y-2">
        <Heading className="text-center">
          What would you like to insert into your document? 📃
        </Heading>
        <Link
          href={`/taskpane/user-trees/${treeId}/select-function/variable-value`}
        >
          <Button className="w-full" variant="secondary">
            <Textbox />
            <span>Variable Value</span>
          </Button>
        </Link>
        <Link
          href={`/taskpane/user-trees/${treeId}/select-function/conditional-text/variable-selection`}
        >
          <Button className="w-full" variant="secondary">
            <Question />
            <span>Conditional Text</span>
          </Button>
        </Link>
      </Stack>
      <Button variant="secondary" className="bg-info5">
        <Info />
        <span>How it works</span>
      </Button>
    </Stack>
  );
}
