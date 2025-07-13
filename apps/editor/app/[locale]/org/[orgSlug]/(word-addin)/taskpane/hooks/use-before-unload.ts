import { useEffect, useRef } from "react";

type BeforeUnloadHandler = (event: BeforeUnloadEvent) => void;

export function useBeforeUnload(handler: BeforeUnloadHandler) {
  const ref = useRef<BeforeUnloadHandler>(handler);

  useEffect(() => {
    ref.current = handler;
  }, [handler]);

  useEffect(() => {
    window.addEventListener("beforeunload", ref.current);

    return () => {
      window.removeEventListener("beforeunload", ref.current);
    };
  }, []);
}
