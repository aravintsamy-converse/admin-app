import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"2xl" | "xl" | "lg" | "md" | "sm" | "xs">("2xl");

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.matchMedia("(min-width: 1536px)").matches) {
        setScreenSize("2xl");
      } else if (window.matchMedia("(min-width: 1280px)").matches) {
        setScreenSize("xl");
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setScreenSize("lg");
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setScreenSize("md");
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setScreenSize("sm");
      } else {
        setScreenSize("xs");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};

export default useScreenSize;