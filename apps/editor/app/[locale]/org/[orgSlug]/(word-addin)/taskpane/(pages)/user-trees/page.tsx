"use client";

// import { motion } from "framer-motion";
// import { useAPIClient } from "@mioto/api-client/useAPIClient";
// import { useTreeAPI } from "@mioto/api-react-binding/useTreeAPI";
// import { Button } from "@mioto/design-system/Button";
// import Heading from "@mioto/design-system/Heading";
// import { Stack } from "@mioto/design-system/Stack";
// import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
// import Link from "next/link";

export default function UserTreesPage() {
  //TODO Needs to be fixed after api refactor
  return <></>;

  // const client = useAPIClient();
  // const {
  //   data: collection,
  //   isSuccess,
  //   isLoading,
  // } = useTreeAPI(client).useTreesQuery();

  // return (
  //   <Stack className="h-full p-4 justify-between">
  //     <Stack className="gap-y-2">
  //       <Heading className="text-center">Select a tree 🌲</Heading>
  //       {isLoading && (
  //         <Stack className="h-full" center>
  //           <LoadingSpinner />
  //         </Stack>
  //       )}
  //       {isSuccess &&
  //         collection.length > 0 &&
  //         collection.map((i) => (
  //           <Link
  //             key={i.uuid}
  //             href={`/taskpane/user-trees/${i.uuid}/select-function`}
  //           >
  //             <motion.div layout transition={{ duration: 0.5 }}>
  //               <Button className="w-full">{i.name}</Button>
  //             </motion.div>
  //           </Link>
  //         ))}
  //     </Stack>
  //   </Stack>
  // );
}
