import { useEffect, useState } from "react";

export const useOnPressKey = <F extends () => void>(fn: F, key: string) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key) {
        fn();
      }
    };
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [fn, key]);
};

export const TestComponent = () => {
  const [count, setCount] = useState(0);

  useOnPressKey(() => {
    alert(count);
  }, "Enter");

  return <button onClick={() => setCount((prev) => prev + 1)}></button>;
};
