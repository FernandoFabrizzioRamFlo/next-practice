"use client";

import { IService } from "@/app/(protected)/services/types/services.types";
import { IClient } from "@/app/(protected)/clients/types/clients.types";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import CreateServiceModal from "./CreateServiceModal";
import UpdateServiceModal from "./UpdateServiceModal";
import { deleteService } from "@/app/(protected)/services/actions/services.actions";

type Props = {
  services: IService[];
  clients: IClient[];
};

function isEnCurso(startDate: string, endDate: string | null): boolean {
  const now = new Date();
  const start = new Date(startDate);

  if (now < start) return false; // Not started yet

  if (!endDate) return true; // No end date means still active

  const end = new Date(endDate);
  return now <= end;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ServicesTable({ services, clients }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  // Map services to table rows
  const tableRows = useMemo(
    () =>
      services.map((s) => ({
        id: s.id,
        client_name: s.client_name,
        en_curso: isEnCurso(s.start_date, s.end_date),
        description: s.name || "Sin descripción",
        start_date: s.start_date,
        end_date: s.end_date,
      })),
    [services]
  );

  const handleUpdate = (id: number) => {
    setSelectedServiceId(id);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;
    startTransition(async () => {
      const result = await deleteService(id);
      if (!result.success) {
        alert(result.error || "Error al eliminar servicio");
      }
    });
  };

  const handleViewDetails = (id: number) => {
    router.push(`/services/${id}`);
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-4 px-4 lg:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-xl font-bold text-balance lg:text-3xl">
          Servicios
        </h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Servicio
        </Button>
      </div>

      {/* Table - Desktop */}
      <div className="border-border hidden overflow-hidden rounded-lg border md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-muted-foreground p-3 text-left text-xs font-medium lg:p-4 lg:text-sm">
                  ID
                </th>
                <th className="text-muted-foreground p-3 text-left text-xs font-medium lg:p-4 lg:text-sm">
                  Cliente
                </th>
                <th className="text-muted-foreground p-3 text-left text-xs font-medium lg:p-4 lg:text-sm">
                  En Curso
                </th>
                <th className="text-muted-foreground p-3 text-left text-xs font-medium lg:p-4 lg:text-sm">
                  Descripción
                </th>
                <th className="text-muted-foreground p-3 text-center text-xs font-medium lg:p-4 lg:text-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {tableRows.map((record, index) => (
                <tr
                  key={record.id}
                  className={index !== tableRows.length - 1 ? "border-border border-b" : ""}
                >
                  <td className="text-card-foreground p-3 text-xs lg:p-4 lg:text-sm">
                    {record.id}
                  </td>
                  <td className="text-card-foreground p-3 text-xs lg:p-4 lg:text-sm">
                    {record.client_name}
                  </td>
                  <td className="p-3 text-xs lg:p-4 lg:text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        record.en_curso
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {record.en_curso ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="text-card-foreground p-3 text-xs lg:p-4 lg:text-sm">
                    {record.description}
                  </td>
                  <td className="p-3 text-center lg:p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(record.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdate(record.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Actualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(record.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Borrar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {tableRows.length === 0 && (
                <tr>
                  <td className="text-muted-foreground p-4 text-sm" colSpan={5}>
                    No hay servicios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="space-y-3 md:hidden">
        {tableRows.map((record) => (
          <div
            key={record.id}
            className="border-border bg-card space-y-3 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-card-foreground text-sm font-medium">
                    #{record.id}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      record.en_curso
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {record.en_curso ? "En curso" : "Finalizado"}
                  </span>
                </div>
                <p className="text-card-foreground mt-1 text-sm">
                  {record.client_name}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {record.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(record.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdate(record.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Actualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(record.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Borrar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {tableRows.length === 0 && (
          <div className="text-muted-foreground text-sm">No hay servicios registrados.</div>
        )}
      </div>

      {/* Create Service Modal */}
      <CreateServiceModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        clients={clients}
      />

      {/* Update Service Modal */}
      <UpdateServiceModal
        serviceId={selectedServiceId}
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        clients={clients}
      />
    </div>
  );
}
