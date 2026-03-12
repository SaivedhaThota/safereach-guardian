import { FakeCall } from "@/components/FakeCall";
import { SirenAlert } from "@/components/SirenAlert";

const ToolsPage = () => (
  <div className="min-h-screen px-4 pt-12 pb-24 max-w-lg mx-auto flex flex-col items-center gap-8">
    <div className="text-center">
      <h1 className="text-2xl font-heading font-bold mb-1">Safety Tools</h1>
      <p className="text-muted-foreground text-sm">Quick tools for your safety</p>
    </div>

    <div className="w-full space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4">
        <h2 className="font-heading font-semibold text-lg">Fake Call</h2>
        <p className="text-sm text-muted-foreground">
          Simulate an incoming call to escape uncomfortable situations
        </p>
        <FakeCall />
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4">
        <h2 className="font-heading font-semibold text-lg">Emergency Siren</h2>
        <p className="text-sm text-muted-foreground">
          Play a loud siren to attract attention nearby
        </p>
        <SirenAlert />
      </div>
    </div>
  </div>
);

export default ToolsPage;
