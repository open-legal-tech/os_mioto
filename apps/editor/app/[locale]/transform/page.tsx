"use client";

import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { IconButton } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Copy } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { transform } from "./transform.action";

export default function Page() {
  const [uint8, setUint8] = React.useState<string>("");
  const methods = Form.useForm({
    defaultValues: {
      json: "",
    },
  });

  return (
    <div className="p-8 h-screen">
      <Form.Provider methods={methods}>
        <Form.Root
          onSubmit={methods.handleAsyncSubmit(async (data) => {
            const result = await transform(data.json);

            setUint8(JSON.stringify(result));
          })}
          className="h-full grid grid-cols-2 grid-rows-[1fr_max-content] w-full gap-4"
        >
          <Stack className="gap-4 rows-[1]">
            <Row className="gap-2 items-center">
              <Heading level={2}>JSON</Heading>
              <IconButton
                tooltip={{ children: "Kopieren" }}
                onClick={() =>
                  navigator.clipboard.writeText(methods.getValues().json)
                }
              >
                <Copy />
              </IconButton>
            </Row>
            <Form.Textarea
              rows={40}
              {...methods.register("json", {
                validate: (value) => {
                  try {
                    JSON.parse(value);
                    return true;
                  } catch (error) {
                    return "Invalid JSON";
                  }
                },
              })}
            />
            <Form.FormError name="json" />
          </Stack>
          <Stack className="gap-4 overflow-hidden h-full rows-[1]">
            <Row className="gap-2 items-center">
              <Heading level={2}>Output</Heading>
              <IconButton
                tooltip={{ children: "Kopieren" }}
                onClick={() => navigator.clipboard.writeText(uint8)}
              >
                <Copy />
              </IconButton>
            </Row>
            <Stack className="overflow-auto border-gray6 border p-2 rounded h-full">
              <Text>{uint8}</Text>
            </Stack>
          </Stack>
          <Form.SubmitButton className="rows-[2] col-span-full justify-self-center">
            Konvertieren
          </Form.SubmitButton>
        </Form.Root>
      </Form.Provider>
    </div>
  );
}