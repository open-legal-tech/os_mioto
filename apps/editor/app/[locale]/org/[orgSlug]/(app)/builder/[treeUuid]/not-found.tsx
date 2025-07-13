import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { EditorNotFound } from "./components/NotFound";

export const metadata = {
  title: "Anwendung nicht gefunden | Mioto",
};

export default async function ProjectNotFound() {
  const { redirect } = await getCurrentEmployee();

  redirect("/dashboard");

  return <EditorNotFound />;
}
