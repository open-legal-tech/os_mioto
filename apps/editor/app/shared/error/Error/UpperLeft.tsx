type Props = {
  className: string;
};

export const UpperLeft = ({ className }: Props) => {
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
      <path
        d="M36 -24C69.1371 -24 96 2.86292 96 36C96 69.1371 69.1371 96 36 96C2.86291 96 -24 69.1371 -24 36C-24 2.86291 2.86292 -24 36 -24Z"
        fill="#FEE4C1"
      />
      <path
        d="M-23.9995 96C42.2747 96 96.0005 149.726 96.0005 216L-23.9995 216L-23.9995 96Z"
        fill="#FEE4C1"
      />
      <path
        d="M156 -24C189.138 -24 216 2.86292 216 36C216 69.1371 189.138 96 156 96C122.863 96 96.0005 69.1371 96.0005 36C96.0005 2.86291 122.863 -24 156 -24Z"
        fill="#FEE4C1"
      />
      <path
        d="M96.0005 216C96.0005 149.726 149.726 96 216 96V216H96.0005Z"
        fill="#FEE4C1"
      />
    </svg>
  );
};
