/**
 * URL base de la API backend configurada vía variables de entorno o valor por defecto.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

/**
 * Parsea la respuesta HTTP y extrae el JSON o lanza un Error descriptivo con el status code.
 * @param {Response} res - Objeto Response de Fetch
 * @param {string} fallbackMessage - Mensaje por defecto en caso de fallo
 * @returns {Promise<any>} Datos parseados en formato JSON
 */
export async function parseApiResponse(res, fallbackMessage = 'Error en la solicitud') {
  let data = null

  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    let message = data?.mensaje || fallbackMessage
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail.map(e => e.msg).join(', ')
      } else {
        message = data.detail
      }
    }
    const error = new Error(message)
    error.status = res.status
    throw error
  }

  return data
}

/**
 * Mapea errores de red o excepciones HTTP a mensajes comprensibles para el usuario.
 * @param {any} error - Error capturado
 * @returns {string} Mensaje de error para mostrar en la interfaz
 */
export function networkErrorMessage(error) {
  if (error?.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.'
  if (!error?.status && error instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
  }
  if (error?.message) return error.message
  return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
}