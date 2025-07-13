import type { Props } from "./Logo";

export const LogoIcon = ({
  className,
  monochrome = false,
}: Omit<Props, "large">) => {
  return (
    <svg
      viewBox="0 0 82 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ aspectRatio: "1/1" }}
      width="100%"
      height="100%"
    >
      <title>Mioto Logo</title>
      <path
        d="M36.0275 34.4604L20.4775 7.53039C19.5575 5.94039 17.2575 5.94039 16.3375 7.53039L0.7875 34.4604C-0.2625 36.2804 -0.2625 38.5304 0.7875 40.3504L16.3375 67.2804C17.2575 68.8704 19.5575 68.8704 20.4775 67.2804L36.0275 40.3504C37.0775 38.5304 37.0775 36.2804 36.0275 34.4604Z"
        className={monochrome ? "fill-gray9" : "fill-primary7"}
      />
      <path
        d="M79.0543 41.3496H47.9543C45.8543 41.3496 43.9043 42.4696 42.8543 44.2896L27.3043 71.2196C26.3843 72.8096 27.5343 74.7996 29.3743 74.7996H60.4743C62.5743 74.7996 64.5243 73.6796 65.5743 71.8596L81.1243 44.9296C82.0443 43.3396 80.8943 41.3496 79.0543 41.3496Z"
        className={monochrome ? "fill-gray9" : "fill-tertiary7"}
      />
      <path
        d="M27.3065 3.58L42.8565 30.51C43.9065 32.33 45.8565 33.45 47.9565 33.45H79.0564C80.8964 33.45 82.0464 31.46 81.1264 29.87C70.4464 11.39 50.7165 0 29.3665 0C27.5265 0 26.3765 1.99 27.2965 3.58H27.3065Z"
        className={monochrome ? "fill-gray9" : "fill-secondary7"}
      />
    </svg>
  );
};
