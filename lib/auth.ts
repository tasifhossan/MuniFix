const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface DecodedUser {
  id: string;
  email: string;
  role: 'citizen' | 'field_worker' | 'dept_admin' | 'super_admin';
}

export interface UserProfile extends DecodedUser {
  name: string;
  department_id?: number;
}

export function parseJwt(token: string): DecodedUser | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}

export function setAuthCookie(token: string) {
  if (typeof window !== "undefined") {
    // Cookie expires in 7 days
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `munifix_authtoken=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function clearAuthCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "munifix_authtoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
}

export async function signUp(payload: any) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Sign up failed");
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Sign in failed");
  }
  return data;
}

export async function signOutRequest(refreshToken: string, authtoken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authtoken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Sign out failed");
  }
  return data;
}

export async function refreshAuthToken(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Token refresh failed");
  }
  return data;
}

export async function fetchMyProfile(authtoken: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/my/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authtoken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }
  // The API returns the profile, lets make sure we handle its structure
  return data.profile || data;
}

export async function verifyOtp(email: string, otp: string) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }
  return data;
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Forgot password request failed");
  }
  return data;
}
