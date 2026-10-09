import { Variants } from 'framer-motion';

// Lamp swing physics requested in prompt:
// "On hover: lamp swings 2–4 degrees, bulb brightness increases, light cone becomes stronger"
export const lampSwingVariants: Variants = {
  initial: {
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
  hover: {
    rotate: [0, -3.5, 2.5, -1, 0],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror"
    }
  },
  active: {
    rotate: [0, -1.5, 1.5, 0],
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Light cone and bloom variants
export const lightConeVariants: Variants = {
  initial: {
    opacity: 0,
    scaleY: 0.8,
    scaleX: 0.8,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  active: {
    opacity: 0.75,
    scaleY: 1,
    scaleX: 1,
    transition: { duration: 0.45, ease: "easeOut" }
  },
  hover: {
    opacity: 0.95,
    scaleY: 1.05,
    scaleX: 1.08,
    transition: { duration: 0.25, ease: "easeOut" }
  }
};

// Editorial scroll reveals:
// "Heading: opacity 0 -> 1, translateY 40px -> 0"
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

// Clip-path reveal for images
export const clipPathReveal: Variants = {
  hidden: {
    clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
    opacity: 0,
    scale: 1.06
  },
  visible: {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};
