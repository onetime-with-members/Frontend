interface EventIconProps {
  fill?: string;
  innerFill?: string;
  size?: number;
}

export default function EventIcon({
  fill = '#4C65E5',
  innerFill = '#FFFFFF',
  size = 24,
}: EventIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        fill={fill}
        stroke={fill}
        strokeWidth="2"
      />
      <path
        d="M11.639 7.25655C11.7839 6.9529 12.2161 6.9529 12.361 7.25655L13.4906 9.62377C13.5489 9.74597 13.6651 9.83038 13.7993 9.84807L16.3997 10.1909C16.7333 10.2348 16.8669 10.6459 16.6228 10.8775L14.7205 12.6833C14.6223 12.7766 14.578 12.9131 14.6026 13.0463L15.0802 15.6253C15.1414 15.9562 14.7918 16.2102 14.4961 16.0497L12.1908 14.7986C12.0718 14.734 11.9282 14.734 11.8092 14.7986L9.50393 16.0497C9.20823 16.2102 8.85855 15.9562 8.91981 15.6253L9.39737 13.0463C9.42203 12.9131 9.37765 12.7766 9.27945 12.6833L7.37715 10.8775C7.13314 10.6459 7.2667 10.2348 7.60026 10.1909L10.2007 9.84807C10.3349 9.83038 10.4511 9.74597 10.5094 9.62377L11.639 7.25655Z"
        fill={innerFill}
      />
    </svg>
  );
}
