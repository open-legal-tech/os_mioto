import * as React from "react";

export const DetailsIcon = React.forwardRef<SVGSVGElement, { color?: string }>(
  ({ color = "currentColor", ...rest }, ref) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
        ref={ref}
        color={color}
        role="presentation"
      >
        <path
          d="M7.75 4.5C7.47386 4.5 7.25 4.72386 7.25 5C7.25 5.27614 7.47386 5.5 7.75 5.5H13.75C14.0261 5.5 14.25 5.27614 14.25 5C14.25 4.72386 14.0261 4.5 13.75 4.5H7.75Z"
          fill="currentcolor"
        />
        <path
          d="M7.75 7.5C7.47386 7.5 7.25 7.72386 7.25 8C7.25 8.27614 7.47386 8.5 7.75 8.5L13.75 8.5C14.0261 8.5 14.25 8.27614 14.25 8C14.25 7.72386 14.0261 7.5 13.75 7.5L7.75 7.5Z"
          fill="currentcolor"
        />
        <path
          d="M7.75 10.5C7.47386 10.5 7.25 10.7239 7.25 11C7.25 11.2761 7.47386 11.5 7.75 11.5L13.75 11.5C14.0261 11.5 14.25 11.2761 14.25 11C14.25 10.7239 14.0261 10.5 13.75 10.5L7.75 10.5Z"
          fill="currentcolor"
        />
        <path
          d="M3.75 9.28578L5.75 6.71436H1.75L3.75 9.28578Z"
          fill="currentcolor"
        />
      </svg>
    );
  },
);
