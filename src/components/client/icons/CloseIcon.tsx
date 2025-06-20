const CloseIcon = ({
  className,
  size,
}: {
  className?: string
  size?: boolean
}) => {
  const Iconsize = size ? '20px' : ''
  const IconStroke = size ? '0.1' : '0.8'
  return (
    <>
      <svg
        data-testid="close-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="13"
        viewBox="0 0 15 13"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={IconStroke}
        className={className}
        style={{ width: Iconsize, height: Iconsize }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.3272 1.92087L9.45479 1L5.59036 5.0856L1.72592 1L0.853516 1.92087L4.72409 6L0.853516 10.0791L1.72592 11L5.59036 6.9144L9.45479 11L10.3272 10.0791L6.45663 6L10.3272 1.92087Z"
        />
      </svg>
    </>
  )
}

export default CloseIcon
