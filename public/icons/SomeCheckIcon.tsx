function SomeCheckIcon({
  height,
  width,
  color
}: {
  height: number;
  width: number;
  color?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={width}
      height={height}
      strokeWidth={2}
      stroke="currentColor"
    >
      <circle cx={12} cy={12} r={12} fill="#000000" opacity="0.05" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#444444"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SomeCheckIcon;
