import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const CALLER_NAMES = ["Mom", "Dad", "Sarah", "Office", "Home"];

export function FakeCall() {
  const [stage, setStage] = useState<"idle" | "ringing" | "answered">("idle");
  const [caller] = useState(() => CALLER_NAMES[Math.floor(Math.random() * CALLER_NAMES.length)]);
  const [timer, setTimer] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Ringtone effect
  useEffect(() => {
    if (stage !== "ringing") return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440;
    gain.gain.value = 0.25;
    osc.start();
    audioCtxRef.current = ctx;
    oscRef.current = osc;

    const interval = setInterval(() => {
      gain.gain.value = gain.gain.value > 0 ? 0 : 0.25;
    }, 800);

    return () => {
      clearInterval(interval);
      osc.stop();
      ctx.close();
      audioCtxRef.current = null;
      oscRef.current = null;
    };
  }, [stage]);

  // Call timer
  useEffect(() => {
    if (stage !== "answered") return;
    setTimer(0);
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAccept = () => setStage("answered");
  const handleDecline = () => setStage("idle");

  if (stage === "idle") {
    return (
      <Button
        onClick={() => setStage("ringing")}
        className="bg-safe text-safe-foreground hover:bg-safe/90 h-14 px-8 text-lg font-heading"
      >
        <Phone className="mr-2 w-5 h-5" />
        Fake Call
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-between py-16 animate-fade-in">
      {/* Top section */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
          <User className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Caller name */}
        <h2 className="text-3xl font-heading font-bold">{caller}</h2>

        {/* Status text */}
        {stage === "ringing" ? (
          <p className="text-muted-foreground text-lg animate-pulse">Incoming Call...</p>
        ) : (
          <p className="text-safe text-lg font-mono">{formatTime(timer)}</p>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center gap-12 mb-8">
        {stage === "ringing" ? (
          <>
            {/* Decline */}
            <button
              onClick={handleDecline}
              className="w-18 h-18 rounded-full bg-primary flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-shake"
              style={{ width: 72, height: 72 }}
            >
              <PhoneOff className="w-8 h-8 text-primary-foreground" />
            </button>

            {/* Accept */}
            <button
              onClick={handleAccept}
              className="w-18 h-18 rounded-full bg-safe flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              style={{ width: 72, height: 72 }}
            >
              <Phone className="w-8 h-8 text-safe-foreground" />
            </button>
          </>
        ) : (
          <button
            onClick={handleDecline}
            className="rounded-full bg-primary flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{ width: 72, height: 72 }}
          >
            <PhoneOff className="w-8 h-8 text-primary-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
