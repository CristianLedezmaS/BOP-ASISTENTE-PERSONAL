export type BopMode = "engineer" | "designer" | "researcher" | "manager";

export type BopStatus = "IDLE" | "THINKING" | "SEARCHING" | "CODING" | "TESTING";

export type PermissionRisk = "INFORMAR" | "PROPONER" | "PREPARAR" | "EJECUTAR" | "ACCION_SENSIBLE";

export type ChatMessage = {
  id: string;
  role: "user" | "bop";
  text: string;
  status?: BopStatus;
  conversation_id?: string;
};

export type PermissionRequest = {
  id: string;
  title: string;
  description: string;
  risk: PermissionRisk;
};
