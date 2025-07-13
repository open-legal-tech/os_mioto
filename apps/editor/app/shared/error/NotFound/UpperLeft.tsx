type Props = {
  className: string;
};

export const UpperLeft = ({ className }: Props) => {
  return (
    <svg
      width="188"
      height="209"
      viewBox="0 0 188 209"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path d="M-52 -31H68C68 35.2742 14.2742 89 -52 89V-31Z" fill="#BEE7E5" />
      <path d="M68 209C68 142.726 121.726 89 188 89V209H68Z" fill="#BEE7E5" />
      <rect x="68" y="-31" width="120" height="120" rx="60" fill="#BEE7E5" />
      <rect x="-52" y="89" width="120" height="120" rx="60" fill="#BEE7E5" />
    </svg>
  );
};
