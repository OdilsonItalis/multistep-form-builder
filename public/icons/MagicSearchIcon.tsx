import React from 'react';

function MagicSearchIcon({
  className,
  width,
  height,
  color
}: {
  width: number;
  height: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 344 344"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_832_98)">
        <path
          d="M290.562 127.901L241.529 111.193L303.684 77.7889L290.562 127.901Z"
          fill="currentColor"
        />
        <line
          x1="243.124"
          y1="233.07"
          x2="326.462"
          y2="327.553"
          stroke="currentColor"
          stroke-width="27"
        />
        <path
          d="M253.367 262.783C231.25 282.321 203.595 294.484 174.247 297.582C144.898 300.68 115.313 294.559 89.6037 280.069C63.8941 265.58 43.3364 243.442 30.7874 216.731C18.2385 190.02 14.3215 160.064 19.5809 131.025C24.8403 101.986 39.0148 75.3063 60.1346 54.6936C81.2545 34.0809 108.271 20.559 137.429 16.0069C166.587 11.4547 196.44 16.0985 222.837 29.2928C249.235 42.4872 270.867 63.5768 284.728 89.631L259.124 103.252C248.094 82.5178 230.879 65.7345 209.871 55.2344C188.864 44.7342 165.107 41.0387 141.903 44.6613C118.698 48.2839 97.1985 59.0448 80.3911 75.4485C63.5838 91.8522 52.3037 113.084 48.1182 136.194C43.9328 159.303 47.0499 183.143 57.0364 204.399C67.023 225.655 83.3829 243.273 103.843 254.804C124.303 266.335 147.846 271.206 171.202 268.741C194.558 266.275 216.566 256.596 234.167 241.047L253.367 262.783Z"
          fill="currentColor"
        />
        <path
          d="M193.5 150L179 116L166 150L132 164L166 178.5L179 212.5L193.5 178.5L227.5 164L193.5 150Z"
          fill="currentColor"
        />
        <path
          d="M131.351 115.788L122.545 95L114.649 115.788L94 124.347L114.649 133.212L122.545 154L131.351 133.212L152 124.347L131.351 115.788Z"
          fill="currentColor"
        />
        <path
          d="M128.471 193.741L122.702 180L117.529 193.741L104 199.399L117.529 205.259L122.702 219L128.471 205.259L142 199.399L128.471 193.741Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_832_98">
          <rect width="344" height="344" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MagicSearchIcon;