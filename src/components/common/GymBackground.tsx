import { motion } from "framer-motion";
import {
  Activity,
  Crosshair,
  Dumbbell,
  Flame,
  Heart,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";

const GymBackground = () => {
  // Helper function for random positioning
  const randomPosition = (min, max) => Math.random() * (max - min) + min;

  const icons = [
    Dumbbell,
    Activity,
    Timer,
    Heart,
    Trophy,
    Flame,
    Crosshair,
    Target,
    Zap,
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Dense Layer of Large Icons */}
      {[...Array(8)].map((_, index) => {
        const Icon = icons[index % icons.length];
        return (
          <motion.div
            key={`large-${index}`}
            initial={{
              opacity: 0.1,
              scale: 0.8,
              x: randomPosition(-100, 100),
              y: randomPosition(-100, 100),
            }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [0.8, 1, 0.8],
              x: [
                randomPosition(-100, 100),
                randomPosition(-50, 50),
                randomPosition(-100, 100),
              ],
              y: [
                randomPosition(-100, 100),
                randomPosition(-50, 50),
                randomPosition(-100, 100),
              ],
              rotate: [-10, 0, -10],
            }}
            transition={{
              duration: randomPosition(6, 10),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
            className="absolute"
            style={{
              right: `${randomPosition(20, 80)}%`,
              top: `${randomPosition(20, 80)}%`,
            }}
          >
            <Icon
              size={100}
              className={`opacity-20 ${
                index % 3 === 0
                  ? "text-blue-500"
                  : index % 3 === 1
                  ? "text-purple-500"
                  : "text-green-500"
              }`}
            />
          </motion.div>
        );
      })}

      {/* Medium Sized Floating Elements */}
      {[...Array(12)].map((_, index) => {
        const Icon = icons[index % icons.length];
        return (
          <motion.div
            key={`medium-${index}`}
            initial={{
              opacity: 0.08,
              scale: 0.6,
              rotate: randomPosition(-30, 30),
            }}
            animate={{
              opacity: [0.08, 0.15, 0.08],
              scale: [0.6, 0.7, 0.6],
              y: [0, randomPosition(-20, 20), 0],
              x: [0, randomPosition(-20, 20), 0],
              rotate: [
                randomPosition(-30, 30),
                randomPosition(-30, 30),
                randomPosition(-30, 30),
              ],
            }}
            transition={{
              duration: randomPosition(4, 8),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            className="absolute"
            style={{
              right: `${randomPosition(10, 90)}%`,
              top: `${randomPosition(10, 90)}%`,
            }}
          >
            <Icon
              size={60}
              className={`opacity-15 ${
                index % 4 === 0
                  ? "text-blue-400"
                  : index % 4 === 1
                  ? "text-purple-400"
                  : index % 4 === 2
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            />
          </motion.div>
        );
      })}

      {/* Small Dynamic Elements */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={`small-${index}`}
          initial={{
            opacity: 0.05,
            scale: 0.4 + Math.random() * 0.2,
          }}
          animate={{
            opacity: [0.05, 0.1, 0.05],
            scale: [0.4, 0.5, 0.4],
            x: [0, randomPosition(-30, 30), 0],
            y: [0, randomPosition(-30, 30), 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: randomPosition(3, 7),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
          className="absolute rounded-full"
          style={{
            width: 10 + (index % 3) * 8,
            height: 10 + (index % 3) * 8,
            left: `${randomPosition(5, 95)}%`,
            top: `${randomPosition(5, 95)}%`,
            background: `rgba(${
              index % 3 === 0
                ? "59, 130, 246"
                : index % 3 === 1
                ? "139, 92, 246"
                : "34, 197, 94"
            }, ${0.1 - (index % 5) * 0.01})`,
          }}
        />
      ))}

      {/* Background Gradient Orbs */}
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={`orb-${index}`}
          initial={{
            opacity: 0.03,
            scale: 1,
          }}
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.2, 1],
            x: [0, randomPosition(-50, 50), 0],
            y: [0, randomPosition(-50, 50), 0],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200 + index * 50,
            height: 200 + index * 50,
            left: `${randomPosition(0, 100)}%`,
            top: `${randomPosition(0, 100)}%`,
            background: `radial-gradient(circle, rgba(${
              index % 2 === 0 ? "59, 130, 246, 0.1" : "139, 92, 246, 0.1"
            }) 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
};

export default GymBackground;
