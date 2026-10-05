export function showToast(message: string, variant: "info" | "success" | "error" = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("mk:toast", { detail: { message, variant } }));
}
