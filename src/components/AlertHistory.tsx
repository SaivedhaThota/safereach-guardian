import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSosAlerts, getLocationLink, type SosAlert } from "@/lib/api";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const STORAGE_KEY = "safeher_alerts";

function saveToStorage(alerts: SosAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

function loadFromStorage(): SosAlert[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function AlertHistory() {
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["sos_alerts"],
    queryFn: getSosAlerts,
    initialData: loadFromStorage,
  });

  useEffect(() => {
    if (alerts.length > 0) saveToStorage(alerts);
  }, [alerts]);

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-8">Loading history...</p>;
  }

  if (alerts.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No SOS alerts sent yet.</p>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert: SosAlert, i: number) => {
        const date = new Date(alert.created_at);
        return (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-card border border-border flex items-start gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleDateString()} &middot; {date.toLocaleTimeString()}
                </span>
              </div>
              <a
                href={getLocationLink(alert.latitude, alert.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
              </a>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3.5 h-3.5 text-safe" />
                <span className="text-xs font-medium text-safe">SOS Sent</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
