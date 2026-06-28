export interface ActiveProfile {
  id: string;
  name: string;
  role: 'citizen' | 'field_worker' | 'dept_admin' | 'super_admin';
  email: string;
  department_id?: number;
}

export const profiles: ActiveProfile[] = [
  {
    id: "f19d2bba-ea7f-4422-b5e1-55c3272e276b",
    name: "John Citizen (Citizen)",
    role: "citizen",
    email: "john@gmail.com"
  },
  {
    id: "a871cb2b-7c7f-4522-a9e1-66e3c3272e1d",
    name: "Waste Admin (Dept Admin)",
    role: "dept_admin",
    email: "wasteadmin@munifix.gov",
    department_id: 3
  },
  {
    id: "e402bba2-da7f-4122-83e1-77d3c3272e2e",
    name: "Roads Admin (Dept Admin)",
    role: "dept_admin",
    email: "roadsadmin@munifix.gov",
    department_id: 2
  },
  {
    id: "c59d9c2e-4b6b-4e12-87ad-d345ff4b10b0",
    name: "Super Admin (Super Admin)",
    role: "super_admin",
    email: "admin@munifix.gov"
  }
];

export function getActiveProfile(): ActiveProfile {
  if (typeof window === "undefined") return profiles[0];
  const stored = localStorage.getItem("munifix_active_profile");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const matched = profiles.find(p => p.id === parsed.id);
      if (matched) return matched;
    } catch (e) {}
  }
  return profiles[0];
}

export function setActiveProfile(profile: ActiveProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("munifix_active_profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("munifix_profile_changed"));
  }
}

const API_BASE_URL = "http://localhost:5000/api";

function getHeaders() {
  const profile = getActiveProfile();
  return {
    "x-user-id": profile.id,
    "x-user-role": profile.role,
    "x-department-id": profile.department_id ? String(profile.department_id) : "",
  };
}

export async function fetchComplaints(filters: { category?: string; priority?: string; status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.priority) params.append("priority", filters.priority.toLowerCase());
  if (filters.status) params.append("status", filters.status.toLowerCase());

  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complaints?${params.toString()}`, {
    method: "GET",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch complaints");
  }
  return res.json();
}

export async function fetchComplaintById(id: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch complaint details");
  }
  return res.json();
}

export async function createComplaint(formData: FormData) {
  const profile = getActiveProfile();
  if (!formData.has("citizen_id")) {
    formData.append("citizen_id", profile.id);
  }

  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: "POST",
    headers: {
      // Browser automatically sets Content-Type boundary for FormData
    },
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit complaint");
  }
  return res.json();
}

export async function updateComplaintStatus(
  id: string, 
  payload: { status: string; notes?: string; worker_id?: string; department_id?: number }
) {
  const profile = getActiveProfile();
  const body = {
    ...payload,
    changed_by: profile.id
  };

  const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders()
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update status");
  }
  return res.json();
}

export async function deleteComplaint(id: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete complaint");
  }
  return res.json();
}
