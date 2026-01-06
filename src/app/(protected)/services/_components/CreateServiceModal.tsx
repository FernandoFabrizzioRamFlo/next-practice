"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createService } from "@/app/(protected)/services/actions/services.actions";
import { IClient } from "@/app/(protected)/clients/types/clients.types";

interface CreateServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: IClient[];
}

export default function CreateServiceModal({
  open,
  onOpenChange,
  clients,
}: CreateServiceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    name: "",
    start_date: "",
    end_date: "",
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setFormData({
        client_id: "",
        name: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [open]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id || !formData.start_date) {
      setError("Cliente y fecha de inicio son requeridos");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createService({
        client_id: parseInt(formData.client_id, 10),
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        name: formData.name || undefined,
      });
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || "Error al crear servicio");
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isPending) return;
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Servicio</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo servicio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-client">Cliente *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => handleChange("client_id", value)}
                disabled={isPending}
              >
                <SelectTrigger id="create-client">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-name">Descripción</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isPending}
                placeholder="Descripción del servicio"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-start_date">Fecha de Inicio *</Label>
              <Input
                id="create-start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-end_date">Fecha de Fin</Label>
              <Input
                id="create-end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                disabled={isPending}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
