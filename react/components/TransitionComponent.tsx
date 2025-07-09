import { useMemo, useState, useTransition } from "react";

const generateData = (count: number) => {
  return Array(count)
    .fill(1)
    .map(() => ({
      id: Math.random(),
    }));
};

const data = generateData(10000);

console.log(data);

export const TransitionComponent = () => {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const searchResult = useMemo(() => {
    return data.filter((v) => v.id.toString().includes(search));
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    startTransition(() => {
      setSearch(value);
    });
  };

  return (
    <>
      <input type="search" value={inputValue} onChange={handleSearch}></input>
      <ul style={{ width: 100, height: 250, maxHeight: 250, overflow: "auto" }}>
        {searchResult.map((v) => (
          <li style={{ height: 20, width: "100%" }}>{v.id}</li>
        ))}
      </ul>
      <div>count: {searchResult.length}</div>
      <div>{isPending ? "loading" : ""}</div>
    </>
  );
};
