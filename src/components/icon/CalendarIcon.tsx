interface CalendarIconProps {
  size?: number;
  fill?: string;
  innerFill?: string;
}

export default function CalendarIcon({
  size = 24,
  fill,
  innerFill,
}: CalendarIconProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
      >
        <rect
          x="1"
          y="3"
          width="16"
          height="15"
          rx="3"
          fill={fill}
          stroke={fill}
          strokeWidth="2"
        />
        <path
          d="M5 7L13 7"
          stroke={innerFill}
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          d="M4 3V1M14 3V1"
          stroke={fill}
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
}