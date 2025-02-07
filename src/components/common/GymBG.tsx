// components/common/GymBG.tsx
const GymBG = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/gym-background.jpg')`, // Make sure to add your image to public folder
          backgroundPosition: "center 30%",
        }}
      >
        {/* Multi-layer overlay for better content readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-900/90" />

        {/* Subtle patterns */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Light beam effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-blue-500/10 via-transparent to-transparent transform -skew-x-12" />
          <div className="absolute top-0 right-1/4 w-1/2 h-full bg-gradient-to-b from-purple-500/10 via-transparent to-transparent transform skew-x-12" />
        </div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GymBG;
