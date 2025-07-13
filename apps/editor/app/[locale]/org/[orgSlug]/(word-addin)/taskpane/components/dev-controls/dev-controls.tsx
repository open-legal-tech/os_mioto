import { Button } from "@mioto/design-system/Button";
import { Stack } from "@mioto/design-system/Stack";
import { getFromSettings } from "../../utils/settings-word";

export function DevControls() {
  return (
    <Stack className="gap-y-2">
      <Button
        className="bg-danger3"
        onClick={() => {
          console.log(getFromSettings());
        }}
      >
        Load Nodes (Settings)
      </Button>
      <Button
        className="bg-danger3"
        onClick={() =>
          Word.run(async (context) => {
            const body = context.document.body;
            const bodyHtml = body.getHtml();

            await context.sync();

            const bodyHtmlValue: string = bodyHtml.value;
            const bodyHtmlDom = new DOMParser().parseFromString(
              bodyHtmlValue,
              "text/html",
            );
            console.log(bodyHtmlDom);
            const nodes = bodyHtmlDom.getElementsByClassName("nodes");

            if (nodes.length === 0) {
              console.log("Nodes from HTML CCs are not found");
            } else {
              Array.prototype.forEach.call(nodes, (node) => {
                console.log(node.innerText);
                // console.log(JSON.parse(node.innerText));
              });
            }
          })
        }
      >
        Load Nodes (Hidden HTML Tag From Content Controls)
      </Button>
    </Stack>
  );
}
