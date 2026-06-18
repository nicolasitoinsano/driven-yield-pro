export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

export async function parseApiResponse(res, fallbackMessage = 'Error en la solicitud') {
  let data = null

  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const message = data?.detail || data?.mensaje || fallbackMessage
    const error = new Error(message)
    error.status = res.status
    throw error
  }

  return data
}

export function networkErrorMessage(error) {
  if (error?.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.'
  if (!error?.status && error instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
  }
  if (error?.message) return error.message
  return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
}
