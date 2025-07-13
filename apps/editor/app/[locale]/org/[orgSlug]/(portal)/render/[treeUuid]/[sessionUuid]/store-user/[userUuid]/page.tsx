import { SetSessionInLocalStorage } from "./SetSessionInLocalStorage";

type Params = {
  params: Promise<{
    orgSlug: string;
    treeUuid: string;
    sessionUuid: string;
    userUuid: string;
  }>;
};

export default async function Page(props: Params) {
  const params = await props.params;

  const {
    orgSlug,
    treeUuid,
    sessionUuid,
    userUuid
  } = params;

  return (
    <SetSessionInLocalStorage
      orgSlug={orgSlug}
      sessionUuid={sessionUuid}
      treeUuid={treeUuid}
      userUuid={userUuid}
    />
  );
}
