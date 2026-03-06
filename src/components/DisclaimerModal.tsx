import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  onAgree: () => void;
}

const DisclaimerModal = ({ open, onAgree }: DisclaimerModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 w-[90%] max-w-2xl border border-accent/20 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-center mb-6">
              <AlertTriangle size={56} className="text-accent-2" />
            </div>

            <h2 className="text-2xl font-bold text-foreground text-center mb-4">
              Important Planning Notice: AI Recommendations are Advisory Only
            </h2>

            <p className="text-muted-foreground text-sm text-center leading-relaxed mb-8">
              The suggestions provided by UrbanAtlas are generated using artificial intelligence and
              publicly available data. They are intended as advisory tools for urban planning
              professionals and stakeholders. These recommendations do not constitute official
              planning decisions, regulatory approvals, or engineering assessments. All AI-generated
              insights should be validated by qualified professionals before any implementation.
              Official approval, detailed feasibility studies, and regulatory compliance are essential
              for responsible urban development.
            </p>

            <button
              onClick={onAgree}
              className="w-full bg-accent text-accent-foreground font-bold rounded-full px-8 py-3 transition-all duration-300 hover:scale-[1.02] glow-accent"
            >
              I Understand & Agree
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;
