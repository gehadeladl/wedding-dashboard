export const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut",
    },
  }),
};

export const fadeInVariant = {
  hidden: {
    opacity: 0,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut",
    },
  }),
};

export const scaleInVariant = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      delay,
      ease: "easeOut",
    },
  }),
};
