const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getHeaders(): Record<string, string> {
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
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
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

  const res = await fetch(`${API_BASE_URL}/complain`, {
    method: "POST",
    headers: {
      ...getHeaders()
    },
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit complaint");
  }
  return res.json();
}

export async function editComplaint(
  id: string,
  payload: { description?: string; category?: string; latitude?: number; longitude?: number }
) {
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to edit complaint");
  }
  return res.json();
}

export async function updateComplaint(
  id: string,
  payload: { description?: string; category?: string; latitude?: number; longitude?: number }
) {
  return editComplaint(id, payload);
}

export async function updateComplaintStatus(
  id: string, 
  payload: { status: string; notes?: string; worker_id?: string; department_id?: number } | FormData
) {
  const isFormData = payload instanceof FormData;
  const headers = getHeaders();

  const res = await fetch(`${API_BASE_URL}/complain/${id}/status`, {
    method: "PATCH",
    headers: isFormData 
      ? { ...headers } 
      : { "Content-Type": "application/json", ...headers },
    body: isFormData ? payload : JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update status");
  }
  return res.json();
}

export async function deleteComplaint(id: string) {
  const res = await fetch(`${API_BASE_URL}/complain/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete complaint");
  }
  return res.json();
}

export async function searchComplaints(params: {
  q?: string;
  category?: string;
  priority?: string;
  status?: string;
  date?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.append("q", params.q);
  if (params.category) queryParams.append("category", params.category);
  if (params.priority) queryParams.append("priority", params.priority);
  if (params.status) queryParams.append("status", params.status);
  if (params.date) queryParams.append("date", params.date);

  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complain/search?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to search complaints");
  }
  return res.json();
}

export async function fetchNotifications() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch notifications");
  }
  return res.json();
}

export async function markNotificationAsRead(id: string) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to mark notification as read");
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

export async function updateMyProfile(payload: { name: string; phone?: string }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/my/profile`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update profile");
  }
  return res.json();
}

export async function uploadMyAvatar(formData: FormData) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/my/avatar`, {
    method: "POST",
    headers: {
      ...headers,
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload avatar");
  }
  return res.json();
}

export async function changeMyPassword(payload: { currentPassword: string; newPassword: string }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/my/password`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to change password");
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
  const res = await fetch(`${API_BASE_URL}/departments`, {
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
  const res = await fetch(`${API_BASE_URL}/users?role=field_worker`, {
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

export async function updateUserStatus(userId: string, isActive: boolean) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user status");
  }
  return res.json();
}


export async function fetchAdminComplaints(filters: { status?: string; category?: string; priority?: string; department_id?: number; citizen_id?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "All") params.append("status", filters.status.toLowerCase());
  if (filters.category && filters.category !== "All") params.append("category", filters.category);
  if (filters.priority && filters.priority !== "All") params.append("priority", filters.priority.toLowerCase());
  if (filters.department_id) params.append("department_id", String(filters.department_id));
  if (filters.citizen_id) params.append("citizen_id", filters.citizen_id);

  const res = await fetch(`${API_BASE_URL}/complain/admin/filter?${params.toString()}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch admin complaints");
  }
  return res.json();
}

export async function fetchDepartments() {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/departments`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch departments");
  }
  return res.json();
}

export async function createDepartment(payload: { name: string; description?: string }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/departments`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create department");
  }
  return res.json();
}

export async function updateDepartment(id: string | number, payload: { name: string; description?: string }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update department");
  }
  return res.json();
}

export async function deleteDepartment(id: string | number) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "DELETE",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete department");
  }
  return res.json();
}

export async function fetchUsers(filters: { role?: string; department_id?: string | number } = {}) {
  const params = new URLSearchParams();
  if (filters.role) params.append("role", filters.role);
  if (filters.department_id) params.append("department_id", String(filters.department_id));

  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch users");
  }
  return res.json();
}

export async function assignComplaint(id: string, payload: { worker_id: string }) {
  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complain/${id}/assign`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to assign complaint");
  }
  return res.json();
}

export async function fetchActivityLogs(filters: { action?: string; startDate?: string; endDate?: string; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.action) params.append("action", filters.action);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);

  const res = await fetch(`${API_BASE_URL}/logs?${params.toString()}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch activity logs");
  }
  return res.json();
}
