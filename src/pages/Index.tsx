import { useCallback } from "react";
import { SOSButton } from "@/components/SOSButton";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { sendSosAlert, getLocationLink } from "@/lib/api";
import { toast } from "sonner";
import { Mic, MicOff, Smartphone } from "lucide-react";

const Index = () => {
  const triggerSOS = useCallback(async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      );
      await sendSosAlert(pos.coords.latitude, pos.coords.longitude);
      const link = getLocationLink(pos.coords.latitude, pos.coords.longitude);
      toast.success("SOS alert sent!", { description: link, duration: 5000 });
    } catch {
      toast.error("Failed to send SOS alert");
    }
  }, []);

  useShakeDetection(triggerSOS);
  const { listening, startListening, stopListening } = useVoiceCommand(triggerSOS);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-24 pt-12">
      <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight">
        Safe<span className="text-primary">Her</span>
      </h1>
      <p className="text-muted-foreground text-sm mb-12">Your safety companion</p>

      <SOSButton />

      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          onClick={listening ? stopListening : startListening}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            listening
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary text-secondary-foreground border border-border"
          }`}
        >
          {listening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          {listening ? 'Listening for "Help me"' : "Enable Voice Command"}
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Smartphone className="w-3 h-3" />
          <span>Shake detection active on mobile</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
