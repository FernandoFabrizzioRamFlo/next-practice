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
import { updateService, getServiceById } from "@/app/(protected)/services/actions/services.actions";
import { IClient } from "@/app/(protected)/clients/types/clients.types";

interface UpdateServiceModalProps {
  serviceId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: IClient[];
}

function formatDateForInput(dateStr: string | null): string {
  if (!dateStr) return "";
  // Handle both ISO string and date-only formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split('T')[0];
}

export default function UpdateServiceModal({
  serviceId,
  open,
  onOpenChange,
  clients,
}: UpdateServiceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch service data when modal opens
  useEffect(() => {
    if (open && serviceId) {
      setIsLoading(true);
      setError(null);
      getServiceById(serviceId)
        .then((result) => {
          if (result.success && result.data) {
            setFormData({
              client_id: String(result.data.client_id),
              name: result.data.name || "",
              start_date: formatDateForInput(result.data.start_date),
              end_date: formatDateForInput(result.data.end_date),
            });
          } else {
            setError(result.error || "Error al cargar servicio");
          }
        })
        .catch(() => {
          setError("Error al cargar servicio");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, serviceId]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;

    setError(null);
    startTransition(async () => {
      const result = await updateService(serviceId, {
        client_id: formData.client_id ? parseInt(formData.client_id, 10) : undefined,
        name: formData.name || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      });
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || "Error al actualizar servicio");
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
          <DialogTitle>Actualizar Servicio</DialogTitle>
          <DialogDescription>
            Modifica los datos del servicio y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="update-client">Cliente</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => handleChange("client_id", value)}
                  disabled={isPending}
                >
                  <SelectTrigger id="update-client">
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
                <Label htmlFor="update-name">Descripción</Label>
                <Input
                  id="update-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isPending}
                  placeholder="Descripción del servicio"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="update-start_date">Fecha de Inicio</Label>
                <Input
                  id="update-start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="update-end_date">Fecha de Fin</Label>
                <Input
                  id="update-end_date"
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
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
