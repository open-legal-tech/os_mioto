type Props = {
  className: string;
};

export const LowerRight = ({ className }: Props) => {
  return (
    <svg
      width="186"
      height="202"
      viewBox="0 0 186 202"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path
        d="M120 0L120 120L-5.24537e-06 120C-2.34843e-06 53.7258 53.7258 -2.89694e-06 120 0Z"
        fill="#BEE7E5"
      />
      <rect
        x="120"
        y="120"
        width="120"
        height="120"
        rx="60"
        transform="rotate(90 120 120)"
        fill="#BEE7E5"
      />
      <path
        d="M240 0L240 120L120 120C120 53.7258 173.726 -2.89694e-06 240 0Z"
        fill="#BEE7E5"
      />
      <path
        d="M120 240L120.001 120L240.001 120C240 186.274 186.275 240 120 240Z"
        fill="#BEE7E5"
      />
    </svg>
  );
};
