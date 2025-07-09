import React, { useCallback } from "react";
import { useState } from "react";

const Item = React.memo(
  ({ label, onClick }: { label: string; onClick: (label: string) => void }) => {
    console.log("Rendered:", label);

    const handleClick = () => {
      onClick(label);
    };
    return <div onClick={handleClick}>{label}</div>;
  }
);

export const MemoList = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback((label: string) => {
    console.log("Clicked", label);
  }, []);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Re-render</button>
      <Item label="One" onClick={handleClick} />
      <Item label="Two" onClick={handleClick} />
      <Item label="Three" onClick={handleClick} />
    </>
  );
};
