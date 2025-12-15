export const Logo = ({ className = "" }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 3D Shadow base */}
      <path
        d="M8 20L24 10L40 20V38L24 48L8 38V20Z"
        fill="#1a1a1a"
        opacity="0.3"
      />
      
      {/* Main hexagon body - Stone texture */}
      <path
        d="M6 18L24 8L42 18V36L24 46L6 36V18Z"
        fill="url(#stoneGradient)"
        stroke="#B87333"
        strokeWidth="1.5"
      />
      
      {/* Inner structure - Building layers */}
      <path
        d="M24 8V46M6 18L42 18M10 24L38 24M10 30L38 30M6 36L42 36"
        stroke="#2D2D2D"
        strokeWidth="0.5"
        opacity="0.3"
      />
      
      {/* KG Letter - 3D effect */}
      <g>
        {/* K shadow */}
        <path
          d="M15 20V34M15 27L22 34M15 27L22 20"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          transform="translate(0.5, 0.5)"
        />
        {/* K main */}
        <path
          d="M14 19V33M14 26L21 33M14 26L21 19"
          stroke="#B87333"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* G shadow */}
        <path
          d="M33 20C30 20 27 22 27 26V28C27 32 30 34 33 34C35 34 37 33 38 31M33 27H38"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          transform="translate(0.5, 0.5)"
        />
        {/* G main */}
        <path
          d="M32 19C29 19 26 21 26 25V27C26 31 29 33 32 33C34 33 36 32 37 30M32 26H37"
          stroke="#B87333"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Top highlight for 3D effect */}
      <path
        d="M6 18L24 8L42 18"
        stroke="#E6E2DD"
        strokeWidth="1"
        opacity="0.6"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="stoneGradient" x1="6" y1="8" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6E2DD" />
          <stop offset="50%" stopColor="#C4C0BB" />
          <stop offset="100%" stopColor="#8A8681" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;