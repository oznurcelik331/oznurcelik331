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
      <g opacity="0.25">
        <path d="M25 46L8 38V22L25 30V46Z" fill="#1a1a1a" />
        <path d="M25 46L42 38V22L25 30V46Z" fill="#0a0a0a" />
      </g>
      
      {/* Left wall - Dark stone */}
      <path
        d="M24 28L6 20V36L24 44V28Z"
        fill="url(#leftWall)"
        stroke="#8A8681"
        strokeWidth="0.5"
      />
      
      {/* Right wall - Light stone */}
      <path
        d="M24 28L42 20V36L24 44V28Z"
        fill="url(#rightWall)"
        stroke="#B87333"
        strokeWidth="0.5"
      />
      
      {/* Roof - Left side */}
      <path
        d="M24 8L6 16L24 24L24 8Z"
        fill="url(#roofLeft)"
        stroke="#B87333"
        strokeWidth="0.8"
      />
      
      {/* Roof - Right side */}
      <path
        d="M24 8L42 16L24 24L24 8Z"
        fill="url(#roofRight)"
        stroke="#A66529"
        strokeWidth="0.8"
      />
      
      {/* Roof ridge highlight */}
      <line
        x1="24" y1="8"
        x2="24" y2="24"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Stone blocks texture - Left wall */}
      <g opacity="0.3">
        <line x1="6" y1="24" x2="24" y2="32" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="6" y1="28" x2="24" y2="36" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="6" y1="32" x2="24" y2="40" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="12" y1="20" x2="12" y2="38" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="18" y1="22" x2="18" y2="40" stroke="#2D2D2D" strokeWidth="0.5" />
      </g>
      
      {/* Stone blocks texture - Right wall */}
      <g opacity="0.2">
        <line x1="24" y1="32" x2="42" y2="24" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="24" y1="36" x2="42" y2="28" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="24" y1="40" x2="42" y2="32" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="30" y1="22" x2="30" y2="40" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="36" y1="20" x2="36" y2="38" stroke="#2D2D2D" strokeWidth="0.5" />
      </g>
      
      {/* Door */}
      <g>
        <path
          d="M20 35L20 44L16 42L16 33L20 35Z"
          fill="url(#doorGradient)"
          stroke="#2D2D2D"
          strokeWidth="0.8"
        />
        <circle cx="18" cy="38" r="0.5" fill="#B87333" />
      </g>
      
      {/* Windows - Left */}
      <g>
        <rect x="10" y="28" width="3" height="3" fill="#4A90E2" opacity="0.7" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="11.5" y1="28" x2="11.5" y2="31" stroke="#2D2D2D" strokeWidth="0.3" />
        <line x1="10" y1="29.5" x2="13" y2="29.5" stroke="#2D2D2D" strokeWidth="0.3" />
      </g>
      
      {/* Windows - Right */}
      <g>
        <rect x="32" y="28" width="3" height="3" fill="#4A90E2" opacity="0.7" stroke="#2D2D2D" strokeWidth="0.5" />
        <line x1="33.5" y1="28" x2="33.5" y2="31" stroke="#2D2D2D" strokeWidth="0.3" />
        <line x1="32" y1="29.5" x2="35" y2="29.5" stroke="#2D2D2D" strokeWidth="0.3" />
      </g>
      
      {/* Chimney */}
      <g>
        <path d="M28 10L32 12L32 18L28 16L28 10Z" fill="url(#chimneyGradient)" stroke="#8A8681" strokeWidth="0.5" />
        <path d="M28 10L32 12L36 10L32 8L28 10Z" fill="#A89F9A" stroke="#8A8681" strokeWidth="0.5" />
      </g>
      
      {/* Foundation stones highlight */}
      <g opacity="0.6">
        <ellipse cx="24" cy="44" rx="18" ry="2" fill="#2D2D2D" opacity="0.2" />
      </g>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="leftWall" x1="6" y1="20" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A89F9A" />
          <stop offset="100%" stopColor="#8A8681" />
        </linearGradient>
        
        <linearGradient id="rightWall" x1="42" y1="20" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6E2DD" />
          <stop offset="100%" stopColor="#C4C0BB" />
        </linearGradient>
        
        <linearGradient id="roofLeft" x1="6" y1="16" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8A6F47" />
          <stop offset="100%" stopColor="#6B5637" />
        </linearGradient>
        
        <linearGradient id="roofRight" x1="42" y1="16" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B87333" />
          <stop offset="100%" stopColor="#8A6F47" />
        </linearGradient>
        
        <linearGradient id="doorGradient" x1="16" y1="33" x2="20" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6B5637" />
          <stop offset="100%" stopColor="#4A3820" />
        </linearGradient>
        
        <linearGradient id="chimneyGradient" x1="28" y1="10" x2="32" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8A8681" />
          <stop offset="100%" stopColor="#6B6561" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;