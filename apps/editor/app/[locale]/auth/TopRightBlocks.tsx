type Props = { className?: string };

export const TopRightBlocks = ({ className }: Props) => {
  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path d="M0 0H120C120 66.2742 66.2742 120 0 120V0Z" fill="#FEE4C1" />
      <path
        d="M120 240C120 173.726 173.726 120 240 120V240H120Z"
        fill="#FEE4C1"
      />
      <rect x="120" width="120" height="120" rx="60" fill="#FEE4C1" />
      <rect y="120" width="120" height="120" rx="60" fill="#FEE4C1" />
    </svg>
  );
};
