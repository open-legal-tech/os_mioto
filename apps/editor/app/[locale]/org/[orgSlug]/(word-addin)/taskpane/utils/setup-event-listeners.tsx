"use client";

import React from "react";
import { selectionStore } from "../selection-store";
import { store } from "../store";

async function contentControlEntered(
  event: Word.ContentControlEnteredEventArgs,
) {
  selectionStore.contentControlId = event.ids[0]?.toString();
}

async function contentControlExit() {
  selectionStore.contentControlId = undefined;
}

async function contentControlDelete(
  event: Word.ContentControlDeletedEventArgs,
) {
  const id = event.ids[0]?.toString();

  if (id) {
    delete store[id];
  }
}

export function SetupEventListeners() {
  React.useEffect(() => {
    Word.run(async (context) => {
      const contentControls = context.document.contentControls;
      contentControls.load("id");
      await context.sync();

      for (let i = 0; i < contentControls.items.length; i++) {
        contentControls.items[i]?.onEntered.add(contentControlEntered);
        contentControls.items[i]?.onExited.add(contentControlExit);
        contentControls.items[i]?.onDeleted.add(contentControlDelete);

        contentControls.items[i]?.track();
      }

      await context.sync();
    });
  }, []);

  return null;
}
