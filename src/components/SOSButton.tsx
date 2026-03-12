import { useState } from "react";
import { Shield } from "lucide-react";
import { sendSosAlert, getLocationLink } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

export function SOSButton() {
  const [sending, setSending] = useState(false);
  const { getLocation } = useGeolocation();

  const handleSOS = async () => {
    if (sending) return;
    setSending(true);
    try {
      const loc = await getLocation();
      await sendSosAlert(loc.latitude, loc.longitude);
      const link = getLocationLink(loc.latitude, loc.longitude);
      toast.success("SOS alert sent successfully!", {
        description: `Location: ${link}`,
        duration: 5000,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to send SOS alert");
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      onClick={handleSOS}
      disabled={sending}
      className="relative w-44 h-44 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-2xl font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-sos disabled:opacity-70"
    >
      <div className="flex flex-col items-center gap-2">
        <Shield className="w-10 h-10" />
        <span>{sending ? "SENDING..." : "SOS"}</span>
      </div>
    </button>
  );
}
