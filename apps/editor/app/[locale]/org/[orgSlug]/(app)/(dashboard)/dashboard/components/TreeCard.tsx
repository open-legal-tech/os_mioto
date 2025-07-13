import Badge from "@mioto/design-system/Badge";
import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { IconButton, IconButtonLink } from "@mioto/design-system/IconButton";
import Link from "@mioto/design-system/Link";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useFormatter, useTranslations } from "@mioto/locale";
import {
  TreeMenu,
  type TreeMenuProps,
} from "@mioto/workflow-builder/editor/components/TreeMenu";
import { ArrowRight, Clock, DotsThree } from "@phosphor-icons/react/dist/ssr";

export type TreeCardProps = {
  tree: TreeMenuProps["tree"] & { updatedAt: string };
  prefetch?: boolean;
  CLIENT_ENDPOINT: string;
};

export function TreeCard({ tree, prefetch, CLIENT_ENDPOINT }: TreeCardProps) {
  const format = useFormatter();
  const t = useTranslations();

  return (
    <Stack className={cardClasses("justify-center p-0")}>
      <Row className="items-center justify-between flex-1">
        <Link
          orgLink
          prefetch={prefetch}
          href={`/builder/${tree.uuid}` as const}
          className={rowClasses(
            {},
            "items-center cursor-pointer gap-2 flex-1 rounded p-4",
          )}
        >
          <Heading size="extra-small">{tree.name}</Heading>
          <Badge className="colorScheme-gray max-w-max gap-2 font-weak">
            <Clock />
            {format.dateTime(new Date(tree.updatedAt), {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Badge>
        </Link>
        <Row className="items-center p-4 gap-1">
          <TreeMenu tree={tree} CLIENT_ENDPOINT={CLIENT_ENDPOINT}>
            <IconButton
              variant="tertiary"
              tooltip={{
                children: t("components.project-menu.label", {
                  treeName: tree.name,
                }),
                delay: 400,
              }}
            >
              <DotsThree weight="bold" />
            </IconButton>
          </TreeMenu>
          <IconButtonLink
            orgLink
            tooltip={{
              children: t("app.dashboard.tree-card.aria-label", {
                name: tree.name,
              }),
              delay: 400,
            }}
            href={`/builder/${tree.uuid}`}
          >
            <ArrowRight />
          </IconButtonLink>
        </Row>
      </Row>
      {tree.description ? (
        <Text className="text-gray9 p-4 pt-0">
          {tree.description.length > 500
            ? `${tree.description.split("").slice(0, 500).join("")}...`
            : tree.description}
        </Text>
      ) : null}
    </Stack>
  );
}
