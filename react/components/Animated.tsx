import { useLayoutEffect, useRef, useState } from "react";

export const Animated = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [render, setRender] = useState(false);
  const timeout = useRef<undefined | number>(undefined);

  useLayoutEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => {
        ref.current?.style.setProperty("opacity", "1");
      });
      setRender(true);
    } else {
      requestAnimationFrame(() => {
        ref.current?.style.setProperty("opacity", "0");
      });
      timeout.current = setTimeout(() => {
        setRender(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [isVisible]);

  const handleChangeVisible = () => {
    setIsVisible((v) => !v);
  };

  return (
    <>
      <button onClick={handleChangeVisible}>visible</button>
      {render && (
        <div
          ref={ref}
          style={{
            width: 200,
            height: 200,
            background: "red",
            opacity: 0,
            transition: "ease 2s opacity",
          }}
        ></div>
      )}
    </>
  );
};
