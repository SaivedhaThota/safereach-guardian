import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContacts, addContact, deleteContact, type Contact } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, Phone } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "safeher_contacts";

function saveToStorage(contacts: Contact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function loadFromStorage(): Contact[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function EmergencyContacts() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    initialData: loadFromStorage,
  });

  // Persist to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0) saveToStorage(contacts);
  }, [contacts]);

  const addMutation = useMutation({
    mutationFn: () => addContact(name, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact added successfully");
      setName("");
      setPhone("");
    },
    onError: () => toast.error("Failed to add contact"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted");
    },
    onError: () => toast.error("Failed to delete contact"),
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name && phone) addMutation.mutate();
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Input
          placeholder="Contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-muted border-border"
        />
        <Input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-muted border-border"
        />
        <Button
          type="submit"
          disabled={addMutation.isPending || !name || !phone}
          className="bg-safe text-safe-foreground hover:bg-safe/90 shrink-0"
        >
          <UserPlus className="mr-2 w-4 h-4" />
          Add
        </Button>
      </form>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No emergency contacts yet. Add your trusted contacts above.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c: Contact, i: number) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.phone}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(c.id)}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
