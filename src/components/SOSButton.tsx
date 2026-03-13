import { useState } from "react";
import { Shield } from "lucide-react";
import { sendSosAlert, getContacts, notifyContacts } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function SOSButton() {
  const [sending, setSending] = useState(false);
  const { getLocation } = useGeolocation();
  const queryClient = useQueryClient();

  const handleSOS = async () => {
    if (sending) return;
    setSending(true);
    try {
      // 1. Get GPS location
      const loc = await getLocation();

      // 2. Save alert + detect nearby users
      const alert = await sendSosAlert(loc.latitude, loc.longitude);

      // 3. Notify emergency contacts
      const contacts = await getContacts();
      if (contacts.length > 0) {
        notifyContacts(contacts, loc.latitude, loc.longitude);
      }

      // 4. Refresh UI data
      queryClient.invalidateQueries({ queryKey: ["sos_alerts"] });

      // 5. Show success with nearby users info
      const nearbyCount = alert.nearbyUsers?.length || 0;
      toast.success("SOS Alert Sent Successfully", {
        description: `${nearbyCount} nearby user${nearbyCount !== 1 ? "s" : ""} notified · ${contacts.length} emergency contact${contacts.length !== 1 ? "s" : ""} alerted`,
        duration: 6000,
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
