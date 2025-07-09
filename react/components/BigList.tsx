import { useDeferredValue, useMemo, useState } from "react";

const generateData = (count: number) => {
  return Array(count)
    .fill(1)
    .map(() => ({
      id: Math.random(),
    }));
};

const data = generateData(10000);

export const BigList = () => {
  const [search, setSearch] = useState("");
  const searchValue = useDeferredValue(search);

  const searchResult = useMemo(() => {
    return data.filter((v) => v.id.toString().includes(searchValue));
  }, [searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <input type="search" value={search} onChange={handleSearch}></input>
      <ul style={{ width: 100, height: 250, maxHeight: 250, overflow: "auto" }}>
        {searchResult.map((v) => (
          <li style={{ height: 20, width: "100%" }}>{v.id}</li>
        ))}
      </ul>
      <div>count: {searchResult.length}</div>
    </>
  );
};
