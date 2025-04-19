import { motion } from 'framer-motion';
import { Loader2} from 'lucide-react'; // Using a spinner icon

const LoadingState = ({ message = "Loading..." }) => { // Allow custom message
  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[200px] text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-10 h-10 text-indigo-500" /> {/* Spinner icon */}
      </motion.div>
      <p className="mt-4 text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;