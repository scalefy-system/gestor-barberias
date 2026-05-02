import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export const cardHoverProps = {
  whileHover: {
    scale: 1.01,
    boxShadow: "0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(245,158,11,0.1)",
    transition: { type: "spring" as const, stiffness: 350, damping: 22 },
  },
  whileTap: { scale: 0.99 },
};

export const buttonProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 },
};

export const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};
