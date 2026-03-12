import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SirenAlert() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    gain.gain.value = 0.5;
    osc.start();

    let freq = 400;
    let rising = true;
    const interval = setInterval(() => {
      if (rising) {
        freq += 30;
        if (freq >= 1200) rising = false;
      } else {
        freq -= 30;
        if (freq <= 400) rising = true;
      }
      osc.frequency.value = freq;
    }, 50);

    return () => {
      clearInterval(interval);
      osc.stop();
      ctx.close();
    };
  }, [active]);

  return (
    <Button
      onClick={() => setActive(!active)}
      className={`h-14 px-8 text-lg font-heading ${
        active
          ? "bg-warning text-warning-foreground hover:bg-warning/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {active ? (
        <>
          <VolumeX className="mr-2 w-5 h-5" />
          Stop Siren
        </>
      ) : (
        <>
          <Volume2 className="mr-2 w-5 h-5" />
          Emergency Siren
        </>
      )}
    </Button>
  );
}
