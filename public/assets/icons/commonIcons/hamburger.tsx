import React from "react";

const Hamburger = () => {
  return (
    <svg
    className="size-base"
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="10" width="18" height="2" rx="0.5" fill={`var(--nav-icon-default-color)`}></rect>
      <rect y="5" width="18" height="2" rx="0.5" fill={`var(--nav-icon-default-color)`}></rect>
      <rect width="18" height="2" rx="0.5" fill={`var(--nav-icon-default-color)`}></rect>
    </svg>
  );
};

export default Hamburger;
