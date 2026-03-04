export default function ECGHeartAnimation() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-card border border-border shadow-2xl">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      {/* Heart silhouette in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 180" className="w-48 h-48 opacity-10 text-primary fill-current animate-[heartbeat_1.5s_ease-in-out_infinite]">
          <path d="M100 170 C40 120 0 80 0 50 C0 22 22 0 50 0 C68 0 84 10 100 30 C116 10 132 0 150 0 C178 0 200 22 200 50 C200 80 160 120 100 170Z" />
        </svg>
      </div>

      {/* ECG line animation */}
      <div className="absolute inset-0 flex items-center">
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-24">
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            {/* Animated mask for sweep effect */}
            <clipPath id="ecgClip">
              <rect x="-600" y="0" width="600" height="120">
                <animate attributeName="x" from="-600" to="600" dur="3s" repeatCount="indefinite" />
              </rect>
            </clipPath>
          </defs>
          {/* Static baseline */}
          <line x1="0" y1="60" x2="600" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.15" />
          {/* ECG waveform path - realistic PQRST pattern repeated */}
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
          {/* Glow effect duplicate */}
          <path
            d="M0,60 L50,60 L60,58 L70,55 L80,58 L90,60 L100,60 L110,60 L115,58 L120,10 L125,100 L130,45 L135,60 L145,60 L155,62 L165,64 L175,62 L185,60 L200,60
               L250,60 L260,58 L270,55 L280,58 L290,60 L300,60 L310,60 L315,58 L320,10 L325,100 L330,45 L335,60 L345,60 L355,62 L365,64 L375,62 L385,60 L400,60
               L450,60 L460,58 L470,55 L480,58 L490,60 L500,60 L510,60 L515,58 L520,10 L525,100 L530,45 L535,60 L545,60 L555,62 L565,64 L575,62 L585,60 L600,60"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
            clipPath="url(#ecgClip)"
            filter="blur(4px)"
          />
        </svg>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 text-right">
        <p className="text-xs text-muted-foreground font-mono">HR</p>
        <p className="text-2xl font-heading font-bold text-primary animate-[heartbeat_1.5s_ease-in-out_infinite]">72</p>
        <p className="text-[10px] text-muted-foreground">BPM</p>
      </div>
      <div className="absolute bottom-4 left-4">
        <p className="text-xs text-muted-foreground font-mono">SpO₂ 98%</p>
        <p className="text-xs text-muted-foreground font-mono">BP 120/80</p>
      </div>
    </div>
  );
}
