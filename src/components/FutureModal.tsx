import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Car, Truck, Bus, Home, Play } from "lucide-react";

interface FutureModalProps {
  open: boolean;
  onClose: () => void;
}

const FutureModal = ({ open, onClose }: FutureModalProps) => {
  const [evAdoption, setEvAdoption] = useState(50);
  const [droneDensity, setDroneDensity] = useState(30);
  const [autonomousBuses, setAutonomousBuses] = useState(false);
  const [wfhAdoption, setWfhAdoption] = useState(40);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 w-[90%] max-w-[650px] border border-accent/20 shadow-2xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center text-muted-foreground"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">What If Mode</h2>
                  <p className="text-sm text-muted-foreground">Simulate urban futures</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* EV Adoption */}
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Car size={18} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">EV Adoption</p>
                    <p className="text-xs text-muted-foreground">{evAdoption}% of vehicles</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={evAdoption}
                  onChange={(e) => setEvAdoption(Number(e.target.value))}
                  className="w-32 accent-accent"
                />
              </div>

              {/* Drone Deliveries */}
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Drone Deliveries</p>
                    <p className="text-xs text-muted-foreground">{droneDensity < 33 ? "Low" : droneDensity < 66 ? "Medium" : "High"} density</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={droneDensity}
                  onChange={(e) => setDroneDensity(Number(e.target.value))}
                  className="w-32 accent-accent"
                />
              </div>

              {/* Autonomous Buses */}
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bus size={18} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Autonomous Buses</p>
                    <p className="text-xs text-muted-foreground">{autonomousBuses ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutonomousBuses(!autonomousBuses)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autonomousBuses ? "bg-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-transform ${autonomousBuses ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* WFH */}
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home size={18} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Work-from-Home</p>
                    <p className="text-xs text-muted-foreground">{wfhAdoption}% adoption</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wfhAdoption}
                  onChange={(e) => setWfhAdoption(Number(e.target.value))}
                  className="w-32 accent-accent"
                />
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-2 text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {simulating ? (
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={16} /> Run Simulation
                </>
              )}
            </button>

            {simulating && (
              <motion.p
                className="text-center text-sm text-accent mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Analyzing future scenarios...
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FutureModal;
