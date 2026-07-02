import type { User } from "../data/users";

const API_URL = "http://localhost:3001/api/users";

export async function obtenerUsuarios(): Promise<User[]> {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }

  const usuarios: User[] = await respuesta.json();

  return usuarios;
}

export async function obtenerUserPorId(id: string | number): Promise<User> {
  const respuesta = await fetch(`http://localhost:3001/api/users/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el user");
  }

  const user: User = await respuesta.json();

  return user;
}
