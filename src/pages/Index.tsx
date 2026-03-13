import { useCallback } from "react";
import { SOSButton } from "@/components/SOSButton";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { AlertHistory } from "@/components/AlertHistory";
import { FakeCall } from "@/components/FakeCall";
import { SirenAlert } from "@/components/SirenAlert";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { sendSosAlert, getContacts, notifyContacts } from "@/lib/api";
import { toast } from "sonner";
import { Mic, MicOff, Smartphone, Users, History, Wrench, Radar } from "lucide-react";
import { LiveLocationMap } from "@/components/LiveLocationMap";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();

  const triggerSOS = useCallback(async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      );
      const alert = await sendSosAlert(pos.coords.latitude, pos.coords.longitude);
      const contacts = await getContacts();
      if (contacts.length > 0) {
        notifyContacts(contacts, pos.coords.latitude, pos.coords.longitude);
      }
      queryClient.invalidateQueries({ queryKey: ["sos_alerts"] });
      const nearbyCount = alert.nearbyUsers?.length || 0;
      toast.success("SOS Alert Sent Successfully", {
        description: `${nearbyCount} nearby users notified · ${contacts.length} emergency contacts alerted`,
        duration: 6000,
      });
    } catch {
      toast.error("Failed to send SOS alert");
    }
  }, [queryClient]);

  useShakeDetection(triggerSOS);
  const { listening, startListening, stopListening } = useVoiceCommand(triggerSOS);

  return (
    <div className="min-h-screen px-4 py-12 max-w-lg mx-auto space-y-12">
      {/* Hero / SOS Section */}
      <section className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight">
          Safe<span className="text-primary">Her</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-10">Your safety companion</p>

        <SOSButton />

        <div className="mt-8 flex flex-col items-center gap-3">
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
      </section>

      {/* Emergency Contacts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Emergency Contacts</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Add trusted contacts who will receive your SOS alerts
        </p>
        <EmergencyContacts />
      </section>

      {/* Alert History */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Alert History</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">Your previous SOS alerts</p>
        <AlertHistory />
      </section>

      {/* Safety Tools */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Safety Tools</h2>
        </div>
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4">
            <h3 className="font-heading font-semibold text-lg">Fake Call</h3>
            <p className="text-sm text-muted-foreground">
              Simulate an incoming call to escape uncomfortable situations
            </p>
            <FakeCall />
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4">
            <h3 className="font-heading font-semibold text-lg">Emergency Siren</h3>
            <p className="text-sm text-muted-foreground">
              Play a loud siren to attract attention nearby
            </p>
            <SirenAlert />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
