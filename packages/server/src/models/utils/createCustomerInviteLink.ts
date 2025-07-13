import serverModelsEnv from "../../../env";

export const createCustomerInviteLink = (
  orgSlug: string,
  customerUuid: string,
) =>
  `${serverModelsEnv.CLIENT_ENDPOINT}/org/${orgSlug}/accept-invite?type=customer&uuid=${customerUuid}`;
