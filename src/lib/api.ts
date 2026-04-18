const AUTH_URL = 'https://functions.poehali.dev/387c08f4-376b-4a24-b4eb-cd406af6f926';

export interface User {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  avatar_emoji: string;
}

function getToken(): string {
  return localStorage.getItem('auth_token') || '';
}

function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function clearToken() {
  localStorage.removeItem('auth_token');
}

export async function register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${AUTH_URL}?action=register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const text = await res.text();
  const data = JSON.parse(typeof text === 'string' && text.startsWith('"') ? JSON.parse(text) : text);
  if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${AUTH_URL}?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  const data = JSON.parse(typeof text === 'string' && text.startsWith('"') ? JSON.parse(text) : text);
  if (!res.ok) throw new Error(data.error || 'Ошибка входа');
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${AUTH_URL}?action=me`, {
    headers: { 'X-Session-Token': token },
  });
  if (!res.ok) { clearToken(); return null; }
  const text = await res.text();
  const data = JSON.parse(typeof text === 'string' && text.startsWith('"') ? JSON.parse(text) : text);
  return data.user;
}

export async function logout() {
  const token = getToken();
  await fetch(`${AUTH_URL}?action=logout`, {
    method: 'POST',
    headers: { 'X-Session-Token': token },
  });
  clearToken();
}

export { getToken };
