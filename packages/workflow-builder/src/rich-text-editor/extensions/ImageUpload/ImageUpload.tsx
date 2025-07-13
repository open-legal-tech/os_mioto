import { ReactNodeViewRenderer } from "@tiptap/react";
import { HeadlessImageUpload } from "./HeadlessImageUpload";
import { ImageUpload as ImageUploadComponent } from "./view/ImageUpload";

export const ImageUpload = HeadlessImageUpload.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent);
  },
});
