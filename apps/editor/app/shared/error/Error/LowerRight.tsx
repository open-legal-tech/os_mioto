type Props = {
  className: string;
};

export const LowerRight = ({ className }: Props) => {
  return (
    <svg
      width="216"
      height="216"
      viewBox="0 0 216 216"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path d="M0 0H120V120H0V0Z" fill="#FEE4C1" />
      <path d="M120 120H240V240H120V120Z" fill="#FEE4C1" />
      <rect x="120" width="120" height="120" rx="60" fill="#FEE4C1" />
      <rect y="120" width="120" height="120" rx="60" fill="#FEE4C1" />
    </svg>
  );
};
