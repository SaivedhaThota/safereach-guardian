import { AlertHistory } from "@/components/AlertHistory";

const HistoryPage = () => (
  <div className="min-h-screen px-4 pt-12 pb-24 max-w-lg mx-auto">
    <h1 className="text-2xl font-heading font-bold mb-1">Alert History</h1>
    <p className="text-muted-foreground text-sm mb-6">Your previous SOS alerts</p>
    <AlertHistory />
  </div>
);

export default HistoryPage;
