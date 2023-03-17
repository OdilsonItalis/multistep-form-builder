import React from 'react';

function ArrowForward({
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
      fill={color || '#000000'}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

export default ArrowForward;
