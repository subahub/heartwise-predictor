import heroHeart from '@/assets/hero-heart.jpg';

export default function ECGHeartAnimation() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl animate-[heartbeatSlow_1.5s_ease-in-out_infinite]">
      {/* Hero heart image */}
      <img src={heroHeart} alt="Anatomical heart with ECG" className="w-full h-full object-cover" />

      {/* ECG pulse overlay moving left to right */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-20">
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <clipPath id="ecgClip">
              <rect x="-600" y="0" width="600" height="120">
                <animate attributeName="x" from="-600" to="600" dur="3s" repeatCount="indefinite" />
              </rect>
            </clipPath>
          </defs>
          <path
            d="M0,60 L50,60 L60,58 L70,55 L80,58 L90,60 L100,60 L110,60 L115,58 L120,10 L125,100 L130,45 L135,60 L145,60 L155,62 L165,64 L175,62 L185,60 L200,60
               L250,60 L260,58 L270,55 L280,58 L290,60 L300,60 L310,60 L315,58 L320,10 L325,100 L330,45 L335,60 L345,60 L355,62 L365,64 L375,62 L385,60 L400,60
               L450,60 L460,58 L470,55 L480,58 L490,60 L500,60 L510,60 L515,58 L520,10 L525,100 L530,45 L535,60 L545,60 L555,62 L565,64 L575,62 L585,60 L600,60"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#ecgClip)"
          />
          </svg>
      </div>
    </div>
  );
}
