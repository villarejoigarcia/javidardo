'use client';

import { motion } from 'framer-motion';

type SlugEntryTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SlugEntryTransition({ children, className }: SlugEntryTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.666, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
