import { useRef } from "react";

export const CounterWithoutState = () => {
  const counter = useRef(0);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const handleStart = () => {
    const id = setInterval(() => {
      counter.current += 1;
      if (spanRef.current) {
        spanRef.current.innerText = String(counter.current);
      }
    }, 1000);

    return () => clearInterval(id);
  };

  return (
    <>
      <button onClick={handleStart}>Start</button>
      <div>
        counter: <span ref={spanRef}>0</span>
      </div>
    </>
  );
};
