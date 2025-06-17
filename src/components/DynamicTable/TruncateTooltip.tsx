// "use client";
// import { useEffect, useRef, useState } from "react";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tootipWrapper";

// interface TruncateTooltipProps {
//   children: React.ReactNode;
//   text: string;
//   className?: string;
// }

// export const TruncateTooltip = ({ children, text, className = "" }: TruncateTooltipProps) => {
//   const ref = useRef<HTMLDivElement | null>(null);
//   console.log("🚀 ~ TruncateTooltip ~ ref:", ref)
//   const [isOverflowing, setIsOverflowing] = useState(false);

//   useEffect(() => {
//     const check = () => {
//       if (ref.current) {
//         setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
//       }
//     };
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   const content = (
//     <div ref={ref} className={className}>
//       {children}
//     </div>
//   );

//   return isOverflowing ? (
//     <Tooltip>
//       <TooltipTrigger asChild>{content}</TooltipTrigger>
//       <TooltipContent>
//         <p>{text}</p>
//       </TooltipContent>
//     </Tooltip>
//   ) : (
//     content
//   );
// };
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tootipWrapper";

interface TruncateTooltipProps {
  text: string;
  className?: string;
}

export const TruncateTooltip = ({
  text,
  className = "",
}: TruncateTooltipProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        setIsOverflowing(
          ref.current.scrollWidth > ref.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  const spanStyles: React.CSSProperties = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline-block",
  };

  const spanContent = (
    <span
      ref={ref}
      style={spanStyles}
      className={`transition-all truncate duration-300 cursor-pointer  ${className}`}
    >
      {text}
    </span>
  );

  return isOverflowing ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{spanContent}</TooltipTrigger>
        <TooltipContent className="text-start"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    spanContent
  );
};
