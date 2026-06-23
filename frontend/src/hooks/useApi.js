const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, options);
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export function postLead(data) {
  return request("/api/leads/", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
}

export function adminLogin(username, password) {
  return request("/api/admin/login/", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username, password }),
  });
}

export function fetchLeads(token, params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  );
  const qs = new URLSearchParams(clean).toString();
  return request(`/api/leads/list/${qs ? "?" + qs : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ALTERADO: recebe params e os repassa como query string
// Antes: ignorava filtros; agora o CSV baixado respeita segmento/interesse/cidade/busca
export async function downloadCsv(token, params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  );
  const qs  = new URLSearchParams(clean).toString();
  const res = await fetch(`${BASE}/api/leads/export/csv/${qs ? "?" + qs : ""}`, {
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

// ALTERADO: idem ao CSV
export async function downloadXlsx(token, params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  );
  const qs  = new URLSearchParams(clean).toString();
  const res = await fetch(`${BASE}/api/leads/export/xlsx/${qs ? "?" + qs : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao exportar XLSX");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `leads_accesssim_${Date.now()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}