import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Red marker icon
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export function LiveLocationMap() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        setError(err.message);
        // Try fallback single position
        navigator.geolocation.getCurrentPosition(
          (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {}
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  if (error && !position) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 text-center space-y-2">
        <MapPin className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground">Allow location access to see the live map</p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 text-center space-y-2 animate-pulse">
        <MapPin className="w-8 h-8 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 280 }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} icon={redIcon} />
          <Circle
            center={[position.lat, position.lng]}
            radius={500}
            pathOptions={{
              color: "hsl(0, 84%, 60%)",
              fillColor: "hsl(0, 84%, 60%)",
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
          <RecenterMap lat={position.lat} lng={position.lng} />
        </MapContainer>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>Latitude: {position.lat.toFixed(6)}</span>
        <span>Longitude: {position.lng.toFixed(6)}</span>
      </div>
    </div>
  );
}
