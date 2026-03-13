import { useQuery } from "@tanstack/react-query";
import { getSosAlerts, getLocationLink, type SosAlert } from "@/lib/api";
import { MapPin, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlertHistory() {
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["sos_alerts"],
    queryFn: getSosAlerts,
  });

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-8">Loading history...</p>;
  }

  if (alerts.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No SOS alerts sent yet.</p>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert: SosAlert, i: number) => {
        const date = new Date(alert.timestamp);
        const mapLink = getLocationLink(alert.latitude, alert.longitude);
        return (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-card border border-border animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-safe" />
                  <span className="text-sm font-medium text-safe">{alert.type || "SOS"} Sent</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString()} &middot; {date.toLocaleTimeString()}
                  </span>
                </div>

                {alert.nearbyUsers && alert.nearbyUsers.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {alert.nearbyUsers.map((u, j) => (
                      <p key={j} className="text-xs text-accent">
                        👤 {u.name} nearby ({u.distance}m) — Notified
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 pl-14">
              <a href={mapLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  View on Map
                </Button>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
