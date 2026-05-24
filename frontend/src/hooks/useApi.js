/**
 * Camada de acesso à API Django.
 * Em desenvolvimento o proxy do Vite evita CORS (vite.config.js).
 * Em produção usa VITE_API_URL.
 */
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, options);
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Público ──────────────────────────────────────────────────
export function postLead(data) {
  return request("/api/leads", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
}

// ── Admin ────────────────────────────────────────────────────
export function adminLogin(username, password) {
  return request("/api/admin/login", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username, password }),
  });
}

export function fetchLeads(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/leads${qs ? "?" + qs : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function downloadCsv(token) {
  const res = await fetch(`${BASE}/api/admin/leads/export.csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao exportar CSV");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `leads_accesssim_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
