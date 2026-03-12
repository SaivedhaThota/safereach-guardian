const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:wlzCHQ00";

export interface Contact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
}

export interface SosAlert {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export const USER_ID = 2;

export async function sendSosAlert(latitude: number, longitude: number): Promise<SosAlert> {
  const res = await fetch(`${BASE_URL}/sos_alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: USER_ID, latitude, longitude }),
  });
  if (!res.ok) throw new Error("Failed to send SOS alert");
  return res.json();
}

export async function getSosAlerts(): Promise<SosAlert[]> {
  const res = await fetch(`${BASE_URL}/sos_alerts?user_id=${USER_ID}`);
  if (!res.ok) throw new Error("Failed to fetch SOS alerts");
  return res.json();
}

export async function addContact(name: string, phone: string): Promise<Contact> {
  const res = await fetch(`${BASE_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: USER_ID, name, phone }),
  });
  if (!res.ok) throw new Error("Failed to add contact");
  return res.json();
}

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(`${BASE_URL}/contacts?user_id=${USER_ID}`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

export async function deleteContact(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/contacts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete contact");
}

export function getLocationLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}
