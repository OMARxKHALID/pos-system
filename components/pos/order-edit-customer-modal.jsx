import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export const EditCustomerNameModal = ({ value, onSave, onClose }) => {
  const [name, setName] = useState(value || "");

  const handleSave = () => {
    onSave(name.trim() || "Guest");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-xs border bg-white/95 backdrop-blur-xl border-white/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">
              Edit Customer Name
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-6 h-6 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
            placeholder="Enter customer name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
          <Button
            className="w-full text-xs font-semibold text-white bg-blue-500 rounded-lg h-9"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
