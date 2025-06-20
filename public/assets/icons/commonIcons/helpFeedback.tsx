import React from "react";

const HelpFeedback = () => {
  return (
    <svg
    className="group"
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
      className="group-hover:fill-icon-color-help-popup-hover-icon-color"
        d="M15.3 0H1.7C0.765 0 0.00849999 0.765 0.00849999 1.7L0 17L3.4 13.6H15.3C16.235 13.6 17 12.835 17 11.9V1.7C17 0.765 16.235 0 15.3 0ZM15.3 11.9H2.6945L1.7 12.8945V1.7H15.3V11.9ZM7.65 8.5H9.35V10.2H7.65V8.5ZM7.65 3.4H9.35V6.8H7.65V3.4Z"
        fill="var(--help-popup-default-icon-color)"
      />
    </svg>
  );
};

export default HelpFeedback;
