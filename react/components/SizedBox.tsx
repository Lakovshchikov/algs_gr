import { useLayoutEffect, useRef, useState } from "react";

export const SizedBox = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handler = () => {
      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        setSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    handler();

    window.addEventListener("resize", handler);

    //       const observer = new ResizeObserver(([entry]) => {
    //     const { width, height } = entry.contentRect;
    //     setSize({ width, height });
    //   });

    //   observer.observe(element);

    //   return () => observer.disconnect();

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        style={{
          minWidth: 200,
          minHeight: 100,
          width: "100vw",
          background: "red",
        }}
      ></div>
      <div>
        Size height:{size.height}px width:{size.width}px
      </div>
    </>
  );
};
