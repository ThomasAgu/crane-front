import { getToken } from "@/src/app/services/JWTService";
import { AppDto, CreateAppDto } from "../dto/AppDto";
import { API_URL } from "./baseService";

export async function getApps(): Promise<AppDto[]> {
    const token = getToken();

    const response = await fetch (`${API_URL}/apps`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error("Hubo un error al cargar las aplicaicones");
    return response.json();
}

export async function getApp(id: string): Promise<AppDto> {
    const token = getToken();

    const response = await fetch (`${API_URL}/apps/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    
    if (!response.ok) throw new Error(`Hubo un error al trarer la aplicacion ${id}`);
    return response.json();
}


export async function restartApp(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/restart`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al resetear la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function getLogs(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/logs`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al traer los logs de la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function getStats(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/stats`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al traer las stats de la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function createApp(appData: CreateAppDto): Promise<AppDto> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(appData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al crear la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function startApp(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/start`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al crear la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function stopApp(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/stop`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al crear la aplicación: ${errorText}`)
  }

  return response.json()
}

export async function scaleApp(id: string): Promise<string> {
  const token = getToken()

  const response = await fetch(`${API_URL}/apps/${id}/scale`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al escalar la aplicación: ${errorText}`)
  }

  return response.json()
}

