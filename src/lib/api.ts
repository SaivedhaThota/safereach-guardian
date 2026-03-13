const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:wlzCHQ00";

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  relationship: string;
}

export interface SosAlert {
  id: number;
  user_id: number;
  type: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  nearbyUsers?: NearbyUser[];
}

export interface NearbyUser {
  name: string;
  distance: number;
}

export const USER_ID = 2;

const CONTACTS_KEY = "safeher_contacts";
const ALERTS_KEY = "safeher_alerts";

// --- localStorage helpers ---
function getStoredContacts(): Contact[] {
  try {
    return JSON.parse(localStorage.getItem(CONTACTS_KEY) || "[]");
  } catch { return []; }
}

function setStoredContacts(contacts: Contact[]) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function getStoredAlerts(): SosAlert[] {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_KEY) || "[]");
  } catch { return []; }
}

function setStoredAlerts(alerts: SosAlert[]) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

// --- Haversine distance (meters) ---
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Simulate nearby users within 500m
function simulateNearbyUsers(lat: number, lng: number): NearbyUser[] {
  const names = ["User A", "User B", "User C", "User D", "User E"];
  const users: NearbyUser[] = [];
  const count = 2 + Math.floor(Math.random() * 3); // 2-4 nearby users
  for (let i = 0; i < count; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.009; // ~500m range
    const offsetLng = (Math.random() - 0.5) * 0.009;
    const distance = Math.round(haversineDistance(lat, lng, lat + offsetLat, lng + offsetLng));
    if (distance <= 500) {
      users.push({ name: names[i], distance });
    }
  }
  if (users.length === 0) {
    users.push({ name: "User A", distance: Math.round(100 + Math.random() * 300) });
  }
  return users.sort((a, b) => a.distance - b.distance);
}

// --- API with localStorage fallback ---

export async function sendSosAlert(latitude: number, longitude: number): Promise<SosAlert> {
  const nearbyUsers = simulateNearbyUsers(latitude, longitude);
  const alert: SosAlert = {
    id: Date.now(),
    user_id: USER_ID,
    type: "SOS",
    latitude,
    longitude,
    timestamp: new Date().toISOString(),
    nearbyUsers,
  };

  // Try Xano in background, but don't block on failure
  try {
    await fetch(`${BASE_URL}/sos_alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: USER_ID, latitude, longitude }),
    });
  } catch {}

  // Always save locally
  const alerts = getStoredAlerts();
  alerts.unshift(alert);
  setStoredAlerts(alerts);

  return alert;
}

export async function getSosAlerts(): Promise<SosAlert[]> {
  // Try Xano first
  try {
    const res = await fetch(`${BASE_URL}/sos_alerts?user_id=${USER_ID}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStoredAlerts(data);
        return data;
      }
    }
  } catch {}
  return getStoredAlerts();
}

export async function addContact(name: string, phone: string, relationship: string): Promise<Contact> {
  const contact: Contact = {
    id: Date.now(),
    user_id: USER_ID,
    name,
    phone,
    relationship,
  };

  try {
    await fetch(`${BASE_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: USER_ID, name, phone }),
    });
  } catch {}

  const contacts = getStoredContacts();
  contacts.push(contact);
  setStoredContacts(contacts);
  return contact;
}

export async function getContacts(): Promise<Contact[]> {
  try {
    const res = await fetch(`${BASE_URL}/contacts?user_id=${USER_ID}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStoredContacts(data);
        return data;
      }
    }
  } catch {}
  return getStoredContacts();
}

export async function deleteContact(id: number): Promise<void> {
  try {
    await fetch(`${BASE_URL}/contacts/${id}`, { method: "DELETE" });
  } catch {}

  const contacts = getStoredContacts().filter((c) => c.id !== id);
  setStoredContacts(contacts);
}

export function getLocationLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

export function notifyContacts(contacts: Contact[], lat: number, lng: number): string[] {
  const link = getLocationLink(lat, lng);
  return contacts.map((c) => `SOS ALERT sent to ${c.name} (${c.relationship})\nLocation: ${link}`);
}
