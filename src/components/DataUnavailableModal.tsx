import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import sadDog1 from "@/assets/sad-dog-1.jpg";
import sadDog2 from "@/assets/sad-dog-2.jpg";

const sadDogImages = [sadDog1, sadDog2];

interface DataUnavailableModalProps {
  open: boolean;
  cityName: string;
  onClose: () => void;
}

const DataUnavailableModal = ({ open, cityName, onClose }: DataUnavailableModalProps) => {
  const selectedImage = useMemo(
    () => sadDogImages[Math.floor(Math.random() * sadDogImages.length)],
    [open]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 w-[90%] max-w-lg border border-accent/20 shadow-2xl text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={selectedImage}
              alt="Sad puppy"
              className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <h3 className="text-xl font-bold text-foreground mb-2">
              <span className="text-accent-2">Oops!</span> Data for "{cityName}" isn't available yet.
            </h3>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              UrbanAtlas is working hard to gather insights for more cities.
              Please try searching another location or check back soon 🙌!
            </p>

            <button
              onClick={onClose}
              className="bg-accent text-accent-foreground font-bold rounded-full px-8 py-3 transition-all duration-300 hover:scale-[1.02] glow-accent"
            >
              <Search size={16} className="inline mr-2" />
              Search Another Location
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataUnavailableModal;
