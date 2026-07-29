import { parseJwt } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getHeaders(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("munifix_authtoken");
    if (token) {
      return {
        "Authorization": `Bearer ${token}`
      };
    }
  }
  return {};
}

export async function fetchComplaints(filters: { category?: string; priority?: string; status?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.priority) params.append("priority", filters.priority.toLowerCase());
  if (filters.status) params.append("status", filters.status.toLowerCase());

  const headers = getHeaders();
  // Call /api/complain instead of /api/complaints
  const res = await fetch(`${API_BASE_URL}/complain?${params.toString()}`, {
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
  const headers = getHeaders();
  // Call /api/complain/:id instead of /api/complaints/:id
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
    method: "GET",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch complaint details");
  }
  return res.json();
}

export async function createComplaint(formData: FormData) {
  const headers = getHeaders();
  if (typeof window !== "undefined" && !formData.has("citizen_id")) {
    const token = localStorage.getItem("munifix_authtoken");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        formData.append("citizen_id", decoded.id);
      }
    }
  }

  // Call /api/complain instead of /api/complaints
  const res = await fetch(`${API_BASE_URL}/complain`, {
    method: "POST",
    headers: {
      ...headers,
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
  let changed_by = "";
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("munifix_authtoken");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        changed_by = decoded.id;
      }
    }
  }

  const body = {
    ...payload,
    changed_by
  };

  const headers = getHeaders();
  // Call /api/complain/:id/status instead of /api/complaints/:id/status
  const res = await fetch(`${API_BASE_URL}/complain/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers
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
  const headers = getHeaders();
  // Call /api/complain/:id instead of /api/complaints/:id
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
    method: "DELETE",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete complaint");
  }
  return res.json();
}

export async function editComplaint(
  id: string,
  payload: { description: string; category: string; latitude?: number; longitude?: number }
) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to edit complaint");
  }
  return res.json();
}

export async function fetchMyProfile() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/my/profile`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch profile");
  }
  return res.json();
}

export async function fetchWorkerTasks() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complain/worker/tasks`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch worker tasks");
  }
  return res.json();
}

export async function fetchAdminDepartments() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/departments`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch departments");
  }
  return res.json();
}

export async function fetchAdminWorkers() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/workers`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch workers");
  }
  return res.json();
}

export async function updateUserRole(userId: string, payload: { role: string; department_id?: number | null }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user role");
  }
  return res.json();
}
