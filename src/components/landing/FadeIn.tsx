import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

export const FadeIn = ({ children, delay = 0, y = 16, ...rest }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const FadeInStagger = ({
  children,
  stagger = 0.08,
  ...rest
}: HTMLMotionProps<"div"> & { children: ReactNode; stagger?: number }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: stagger } },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const FadeInItem = ({ children, y = 16, ...rest }: HTMLMotionProps<"div"> & { children: ReactNode; y?: number }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    {...rest}
  >
    {children}
  </motion.div>
);
