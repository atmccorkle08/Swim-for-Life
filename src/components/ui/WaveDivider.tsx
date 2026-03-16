interface WaveDividerProps {
  variant?: "gentle" | "playful" | "scallop";
  fill?: string;
  bgColor?: string;
  flip?: boolean;
  className?: string;
}

export default function WaveDivider({
  variant = "gentle",
  fill = "#ECFEFF",
  bgColor,
  flip = false,
  className = "",
}: WaveDividerProps) {
  const paths = {
    gentle:
      "M0,64 C288,120 576,0 720,48 C864,96 1080,160 1440,96 L1440,320 L0,320 Z",
    playful:
      "M0,96 C180,160 360,32 540,80 C720,128 900,16 1080,64 C1260,112 1380,48 1440,80 L1440,320 L0,320 Z",
    scallop:
      "M0,128 Q180,32 360,128 Q540,224 720,128 Q900,32 1080,128 Q1260,224 1440,128 L1440,320 L0,320 Z",
  };

  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${
        flip ? "rotate-180" : ""
      } ${className}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={paths[variant]} fill={fill} />
      </svg>
    </div>
  );
}
