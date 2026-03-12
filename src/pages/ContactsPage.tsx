import { EmergencyContacts } from "@/components/EmergencyContacts";

const ContactsPage = () => (
  <div className="min-h-screen px-4 pt-12 pb-24 max-w-lg mx-auto">
    <h1 className="text-2xl font-heading font-bold mb-1">Emergency Contacts</h1>
    <p className="text-muted-foreground text-sm mb-6">
      Add trusted contacts who will receive your SOS alerts
    </p>
    <EmergencyContacts />
  </div>
);

export default ContactsPage;
