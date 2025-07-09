import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [currentValue, setCurrentValue] = useState(value);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    console.log("USE EFFECT CALLED");
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setCurrentValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout.current);
      console.log("CLEAR");
    };
  }, [delay, value]);

  return currentValue;
};

export function SearchInput() {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 500);

  useEffect(() => {
    if (debounced) {
      console.log("SEARCH INPUT CALLED");
    }
  }, [debounced]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
