type Props = { className?: string };

export const ErrorIcon = ({ className }: Props) => {
  return (
    <svg
      width="206"
      height="197"
      viewBox="0 0 206 197"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <rect
        x="15.2896"
        y="119.426"
        width="160"
        height="40"
        transform="rotate(-45 15.2896 119.426)"
        fill="#FEEDD7"
      />
      <rect
        x="43.5737"
        y="6.28931"
        width="160"
        height="40"
        transform="rotate(45 43.5737 6.28931)"
        fill="#FEEDD7"
      />
      <circle cx="86" cy="77" r="110" stroke="#FEEDD7" strokeWidth="20" />
    </svg>
  );
};
