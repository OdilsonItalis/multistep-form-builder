import { motion } from 'framer-motion';

export const FullWidthMotionButton = ({
  handlerFunction,
  text
}: {
  handlerFunction: () => void;
  text: string;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlerFunction}
      className="flex flex-shrink-0 w-full bg-blue-400 h-10 text-white font-semibold items-center justify-center rounded shadow-lg capitalize "
    >
      {text}
    </motion.button>
  );
};
export const MotionButton = ({
  handlerFunction,
  text,
  className
}: {
  handlerFunction: () => void;
  text: string;
  className?: string;
}) => {
  return (
    <motion.button
      // whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlerFunction}
      className={className}
    >
      {text}
    </motion.button>
  );
};
