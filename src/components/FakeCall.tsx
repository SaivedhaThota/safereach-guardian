import { useState, useRef, useEffect } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const CALLER_NAMES = ["Mom", "Dad", "Sarah", "Office", "Home"];

export function FakeCall() {
  const [active, setActive] = useState(false);
  const [caller] = useState(() => CALLER_NAMES[Math.floor(Math.random() * CALLER_NAMES.length)]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (active) {
      // Use a simple oscillator as ringtone
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      gain.gain.value = 0.3;
      osc.start();

      const interval = setInterval(() => {
        gain.gain.value = gain.gain.value > 0 ? 0 : 0.3;
      }, 1000);

      return () => {
        clearInterval(interval);
        osc.stop();
        ctx.close();
      };
    }
  }, [active]);

  return (
    <div className="flex flex-col items-center gap-4">
      {!active ? (
        <Button
          onClick={() => setActive(true)}
          className="bg-safe text-safe-foreground hover:bg-safe/90 h-14 px-8 text-lg font-heading"
        >
          <Phone className="mr-2 w-5 h-5" />
          Fake Call
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card border border-border animate-in fade-in">
          <p className="text-muted-foreground text-sm">Incoming Call</p>
          <p className="text-2xl font-heading font-bold">{caller}</p>
          <div className="flex gap-6">
            <button
              onClick={() => setActive(false)}
              className="w-16 h-16 rounded-full bg-safe flex items-center justify-center"
            >
              <Phone className="w-7 h-7 text-safe-foreground" />
            </button>
            <button
              onClick={() => setActive(false)}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
            >
              <PhoneOff className="w-7 h-7 text-primary-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
