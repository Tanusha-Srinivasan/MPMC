import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  const hoverProps = hoverEffect
    ? { whileHover: { y: -4, boxShadow: 'var(--tw-shadow-card-hover)' } } // Use CSS var for shadow
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-xl shadow-card overflow-hidden border border-gray-100 ${className}`} // Use custom shadow, increased rounding
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;