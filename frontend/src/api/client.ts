const BASE_URL = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  register: (username: string, password: string) =>
    fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }).then((r) => r.json()),

  login: (username: string, password: string) =>
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }).then((r) => r.json()),

  getSummary: () =>
    fetch(`${BASE_URL}/summary`, { headers: authHeaders() }).then((r) => r.json()),

  getTasks: () =>
    fetch(`${BASE_URL}/tasks`, { headers: authHeaders() }).then((r) => r.json()),

  createTask: (title: string, is_routine: boolean) =>
    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, is_routine }),
    }).then((r) => r.json()),

  updateTask: (id: number, is_done: boolean) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ is_done }),
    }).then((r) => r.json()),

  deleteTask: (id: number) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => r.json()),

  pullGacha: () =>
    fetch(`${BASE_URL}/gacha/pull`, {
      method: "POST",
      headers: authHeaders(),
    }).then((r) => r.json()),

  getMyCostumes: () =>
    fetch(`${BASE_URL}/gacha/costumes`, { headers: authHeaders() }).then((r) => r.json()),

  getMyCharacters: () =>
    fetch(`${BASE_URL}/users/me/characters`, { headers: authHeaders() }).then((r) => r.json()),

  updateSelection: (character_id: number, costume_id?: number) =>
    fetch(`${BASE_URL}/users/me/selection`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ character_id, costume_id }),
    }).then((r) => r.json()),
};
