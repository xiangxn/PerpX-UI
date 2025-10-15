import { motion } from 'framer-motion';
import { useGesture } from 'react-use-gesture';
import { LucideIcon, ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  icon: LucideIcon;
  onBack: () => void;
}

export default function PlaceholderPage({ title, icon: Icon, onBack }: PlaceholderPageProps) {
  const bind = useGesture({
    onDrag: ({ direction: [xDir], velocity }) => {
      if (xDir > 0 && velocity > 0.3) {
        onBack();
      }
    },
  });

  return (
    <div {...bind()} className="h-full w-full flex flex-col p-6 mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-center w-full gap-3"
      >
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </motion.button> */}
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center"
      >
        <div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6"
          >
            <Icon size={80} className="text-white/50 mx-auto" />
          </motion.div>
          <p className="text-white/60 text-lg mb-8">即将推出...</p>
          <motion.div
            className="flex gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white/30 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
