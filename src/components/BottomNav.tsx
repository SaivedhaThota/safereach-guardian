import { Link, useLocation } from "react-router-dom";
import { Shield, Users, History, Mic } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: Shield, label: "SOS" },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/history", icon: History, label: "History" },
  { to: "/tools", icon: Mic, label: "Tools" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
