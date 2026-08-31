import { ChatMessage, PermissionRequest } from "@/types/bop";

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "bop",
    status: "THINKING",
    text: "Analizo primero, ejecuto despues. Si una accion cambia datos, permisos, dinero o archivos sensibles, pedire confirmacion."
  },
  {
    id: "m2",
    role: "user",
    text: "BOP, revisa mi proyecto y dime el siguiente paso tecnico."
  },
  {
    id: "m3",
    role: "bop",
    status: "CODING",
    text: "Primero revisaria arquitectura, seguridad, dependencias y estado de Git. Despues propondria cambios concretos y verificables."
  }
];

export const permissionRequests: PermissionRequest[] = [
  {
    id: "p1",
    title: "Enviar mensaje externo",
    description: "BOP puede preparar el texto, pero necesita aprobacion antes de enviarlo.",
    risk: "ACCION_SENSIBLE"
  },
  {
    id: "p2",
    title: "Modificar archivos del proyecto",
    description: "Permitido cuando el usuario solicita construir o corregir codigo.",
    risk: "EJECUTAR"
  },
  {
    id: "p3",
    title: "Investigar informacion actual",
    description: "BOP debe priorizar documentacion oficial y no inventar datos.",
    risk: "PREPARAR"
  }
];
