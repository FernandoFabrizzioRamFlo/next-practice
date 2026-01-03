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
import { IClient } from "@/app/(protected)/clients/types/clients.types";
import { updateClient, getClientById } from "@/app/(protected)/clients/actions/clients.actions";

interface UpdateClientModalProps {
  clientId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateClientModal({
  clientId,
  open,
  onOpenChange,
}: UpdateClientModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone_number: "",
  });

  // Fetch client data when modal opens
  useEffect(() => {
    if (open && clientId) {
      setIsLoading(true);
      setError(null);
      getClientById(clientId)
        .then((result) => {
          if (result.success && result.data) {
            setFormData({
              name: result.data.name || "",
              contact_person: result.data.contact_person || "",
              email: result.data.email || "",
              phone_number: result.data.phone_number || "",
            });
          } else {
            setError(result.error || "Error al cargar cliente");
          }
        })
        .catch(() => {
          setError("Error al cargar cliente");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, clientId]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setError(null);
    startTransition(async () => {
      const result = await updateClient(clientId, formData);
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || "Error al actualizar cliente");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setError(null);
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone_number: "",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos del cliente y guarda los cambios.
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
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_person">Persona de Contacto</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleChange("contact_person", e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Teléfono</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
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
                onClick={handleClose}
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
