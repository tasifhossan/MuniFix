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

export async function fetchAllComplaints(params: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status) queryParams.append("status", params.status);
  if (params.category) queryParams.append("category", params.category);

  const headers = getHeaders();
  const res = await fetch(`${API_BASE_URL}/complain/all?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      ...headers,
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch all complaints");
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

export interface VoteResponse {
  success?: boolean;
  upvote_count?: number;
  downvote_count?: number;
  user_vote?: 1 | -1 | null;
  message?: string;
}

export interface Comment {
  id: string;
  complaint_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  author_id: string;
  author_name: string;
  author_role: string;
  upvote_count?: number;
  downvote_count?: number;
  user_vote?: 1 | -1 | null;
  is_pinned?: boolean;
}

export interface CommentsFetchResponse {
  success?: boolean;
  count?: number;
  data?: Comment[];
  comments?: Comment[];
}

const getAuthHeaders = (): Record<string, string> => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("munifix_authtoken") || localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as Record<string, unknown>));
    const errorMessage =
      typeof errorData.message === "string"
        ? errorData.message
        : `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

// --- Voting Service ---
export const toggleVote = async (
  complaintId: string,
  voteType: "upvote" | "downvote"
): Promise<VoteResponse> => {
  const numericVoteType = voteType === "upvote" ? 1 : -1;

  const response = await fetch(`${API_BASE_URL}/complain/${complaintId}/vote`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ vote_type: numericVoteType }),
    credentials: "include",
  });
  return handleResponse<VoteResponse>(response);
};

// --- Comment Service ---
export const getComments = async (
  complaintId: string
): Promise<CommentsFetchResponse> => {
  const response = await fetch(`${API_BASE_URL}/complain/${complaintId}/comments`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<CommentsFetchResponse>(response);
};

export const addComment = async (
  complaintId: string,
  content: string,
  imageFile?: File | null
): Promise<{ success: boolean; data: Comment }> => {
  const headers = getAuthHeaders();
  let body: BodyInit;

  if (imageFile) {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", imageFile);
    delete headers["Content-Type"];
    body = formData;
  } else {
    body = JSON.stringify({ content });
  }

  const response = await fetch(`${API_BASE_URL}/complain/${complaintId}/comments`, {
    method: "POST",
    headers,
    body,
    credentials: "include",
  });
  return handleResponse<{ success: boolean; data: Comment }>(response);
};

export const deleteComment = async (
  complaintId: string,
  commentId: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/complain/comments/${commentId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );
  return handleResponse<{ success: boolean; message?: string }>(response);
};

export interface Roadblock {
  id: string;
  department_id: number | null;
  title: string;
  description: string;
  cause: string;
  severity: string;
  is_active: boolean;
  latitude: string;
  longitude: string;
  affected_radius_meters: number;
  blocked_polyline: [number, number][] | null;
  created_by: string;
  created_at: string;
}

export const fetchRoadblocks = async (): Promise<{
  success: boolean;
  count: number;
  roadblocks: Roadblock[];
}> => {
  const response = await fetch(`${API_BASE_URL}/traffic/roadblocks`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; count: number; roadblocks: Roadblock[] }>(response);
};

export interface ReroutePayload {
  roadblock_id: string;
  origin_lat: number;
  origin_lng: number;
  destination_lat: number;
  destination_lng: number;
  origin_name?: string;
  destination_name?: string;
}

export interface RerouteResponse {
  success: boolean;
  message: string;
  data: {
    optimization_id: string;
    roadblock: {
      id: string;
      title: string;
      cause: string;
      severity: string;
      is_active: boolean;
    };
    metrics: {
      blocked_eta_mins: number;
      bypass_eta_mins: number;
      distance_diff_km: number;
      time_saved_mins: number;
    };
    ai_reasoning: string;
    paths: {
      blocked_path: [number, number][];
      bypass_path: [number, number][];
    };
  };
}

export const requestAIReroute = async (
  payload: ReroutePayload
): Promise<RerouteResponse> => {
  const response = await fetch(`${API_BASE_URL}/traffic/reroute`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<RerouteResponse>(response);
};

export interface CommentVoteResponse {
  success: boolean;
  message: string;
  data: {
    comment_id: string;
    current_user_vote: 1 | -1 | null;
    upvote_count: number;
    downvote_count: number;
    score: number;
  };
}

export const toggleCommentVote = async (
  commentId: string,
  voteType: 1 | -1
): Promise<CommentVoteResponse> => {
  const response = await fetch(`${API_BASE_URL}/complain/comments/${commentId}/vote`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vote_type: voteType }),
    credentials: "include",
  });
  return handleResponse<CommentVoteResponse>(response);
};

export const pinComment = async (
  commentId: string,
  isPinned: boolean
): Promise<{ success: boolean; message: string; comment: Comment }> => {
  const response = await fetch(`${API_BASE_URL}/complain/comments/${commentId}/pin`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_pinned: isPinned }),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string; comment: Comment }>(response);
};

export interface CreateRoadblockPayload {
  title: string;
  description: string;
  cause?: string;
  severity?: string;
  latitude: number;
  longitude: number;
  affected_radius_meters?: number;
  blocked_polyline?: [number, number][] | null;
  department_id?: number | null;
}

export const createRoadblock = async (
  payload: CreateRoadblockPayload
): Promise<{ success: boolean; message: string; roadblock: Roadblock }> => {
  const response = await fetch(`${API_BASE_URL}/traffic/roadblocks`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string; roadblock: Roadblock }>(response);
};

export const updateRoadblockStatus = async (
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string; roadblock: Roadblock }> => {
  const response = await fetch(`${API_BASE_URL}/traffic/roadblocks/${id}/status`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_active: isActive }),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string; roadblock: Roadblock }>(response);
};

export const getRoadSnappedPath = async (
  coords: [number, number][]
): Promise<[number, number][]> => {
  if (coords.length < 2) return coords;
  try {
    const coordinateString = coords.map(([lat, lng]) => `${lng},${lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinateString}?geometries=geojson&overview=full`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("OSRM routing failed");
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const geojson = data.routes[0].geometry;
      return geojson.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
    }
  } catch (error) {
    console.error("Error snapping path to roads via OSRM:", error);
  }
  return coords;
};