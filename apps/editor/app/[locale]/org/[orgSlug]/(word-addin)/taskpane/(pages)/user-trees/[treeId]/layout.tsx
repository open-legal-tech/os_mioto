"use client";

import { Button } from "@mioto/design-system/Button";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { TreeProvider } from "@mioto/workflow-builder/tree/TreeProvider";
import { CaretLeft, Info } from "@phosphor-icons/react/dist/ssr";
import { type ReactNode, useMemo, use } from "react";
import {
  usePathname,
  useRouter,
} from "../../../../../../../../../i18n/routing";

interface TreeIdLayoutProps {
  children: ReactNode;
  params: Promise<{
    treeId: string;
  }>;
}

export default function TreeIdLayout(props: TreeIdLayoutProps) {
  const params = use(props.params);

  const {
    treeId
  } = params;

  const {
    children
  } = props;

  const { back } = useRouter();
  const pathname = usePathname();
  const label = useMemo<string | null>(() => {
    if (pathname?.includes("variable-value")) {
      return "Select Variable";
    }

    if (pathname?.includes("conditional-text")) {
      return "Configure conditional text";
    }

    return null;
  }, [pathname]);

  return (
    <TreeProvider id={treeId}>
      {/* TODO add plugins to word add-in */}
      {/* <EditorTreeClientProvider plugins={{}}> */}
      <Stack className="h-full">
        <Row className="justify-between items-center bg-[#f0f9f9] px-4 py-2">
          <Button className="p-1" variant="secondary" onClick={() => back()}>
            <CaretLeft />
          </Button>
          <Text emphasize="strong">{label}</Text>
          <Info />
        </Row>
        <Stack className="h-full p-4">{children}</Stack>
      </Stack>
      {/* </EditorTreeClientProvider> */}
    </TreeProvider>
  );
}
