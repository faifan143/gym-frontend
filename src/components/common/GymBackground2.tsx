// components/common/GymBackground.tsx
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const FloatingEquipment = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  const randomPath = {
    x: [0, Math.random() * 30 - 15, 0],
    y: [0, Math.random() * 30 - 15, 0],
    rotate: [0, Math.random() * 30 - 15, 0],
  };

  useEffect(() => {
    if (inView) {
      controls.start({
        ...randomPath,
        transition: {
          duration: 5 + index,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    }
  }, [controls, index, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={controls}
      className="absolute"
      style={{
        top: `${20 + Math.random() * 60}%`,
        left: `${20 + Math.random() * 60}%`,
      }}
    >
      {children}
    </motion.div>
  );
};

const GlowingOrb = ({ delay, color }: { delay: number; color: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute w-64 h-64 rounded-full blur-3xl ${color}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  );
};

// 3D Equipment Models (using Spline)
const GymEquipment3D = () => {
  return (
    <div className="absolute inset-0 opacity-30">
      {/* <Spline scene="https://app.spline.design/file/d2621c5c-8ed8-41c2-8efd-5b3da23b0244" />{" "} */}
      {/* Replace with your Spline scene URL */}
    </div>
  );
};

const gymEquipment = [
  {
    icon: (
      <motion.svg
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        className="text-blue-500/20"
        whileHover={{ scale: 1.2, opacity: 0.8 }}
      >
        <motion.path
          d="M6 12h12M4 8h2v8H4V8zm14 0h2v8h-2V8zM8 5h8v14H8V5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.svg>
    ),
  },
  // Add more equipment with animated SVG paths
];

export default function GymBackground() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
    >
      {/* 3D Models Layer */}
      <GymEquipment3D />

      {/* Glowing Orbs Layer */}
      <GlowingOrb delay={0} color="bg-blue-500/10" />
      <GlowingOrb delay={2} color="bg-purple-500/10" />
      <GlowingOrb delay={4} color="bg-emerald-500/10" />

      {/* Animated Equipment Layer */}
      {gymEquipment.map((item, index) => (
        <FloatingEquipment key={index} index={index}>
          {item.icon}
        </FloatingEquipment>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent" />

      {/* Grid Pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "100px 100px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
