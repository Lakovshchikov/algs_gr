import { useEffect, type RefObject } from "react";

export const useClickOutside = <F extends (...args: unknown[]) => void>(
  fn: F,
  ref: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const element = ref.current;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (element && event.target && !element.contains(event.target as Node)) {
        fn();
      }
    };

    document.addEventListener("click", listener);
    document.addEventListener("touchend", listener);

    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("touchend", listener);
    };
  }, [fn, ref]);
};
