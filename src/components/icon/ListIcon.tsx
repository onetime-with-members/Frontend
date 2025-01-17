interface ListIconProps {
  fill?: string;
  size?: number;
}

export default function ListIcon({
  fill = '#677CEE',
  size = 24,
}: ListIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect x="3" y="13.5" width="18" height="7.5" rx="2" fill={fill} />
      <rect x="3" y="3" width="18" height="7.5" rx="2" fill={fill} />
    </svg>
  );
}
