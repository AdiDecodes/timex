/**
 * src/services/auth.ts
 * Frontend authentication service for Timex Ceramic Admin
 */

const API_BASE = "/api/v1/auth";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthStatusResponse {
  success: boolean;
  setupRequired: boolean;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}

export interface SetupPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const res = await fetch(`${API_BASE}/status?_t=${Date.now()}`, {
      credentials: "include",
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, setupRequired: false, error: err.message };
  }
}

export async function setupInitialAdmin(payload: SetupPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function loginAdmin(usernameOrEmail: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });
  return await res.json();
}

export async function getAdminProfile(token: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function changeAdminPassword(
  payload: ChangePasswordPayload,
  token: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function forgotPassword(
  email: string
): Promise<{ success: boolean; message?: string; resetToken?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function resetPasswordWithToken(
  payload: ResetPasswordPayload
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return await res.json();
}
