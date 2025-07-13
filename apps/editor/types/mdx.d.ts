import type { JSX } from "react";
declare module "*.mdx" {
  export const meta: any;
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}
