import { reactive } from 'vue'

const toasts = reactive([])

/**
 * Composable reactivo para la gestión de notificaciones temporales tipo Toast en la interfaz.
 */
export function useToast() {
  /**
   * Muestra un mensaje emergente durante un tiempo determinado.
   * @param {string} message - Texto de la notificación
   * @param {'info' | 'success' | 'error'} type - Tipo de notificación
   * @param {number} duration - Duración en milisegundos
   */
  function show(message, type = 'info', duration = 3000) {
    const id = Date.now()
    toasts.push({ id, message, type })
    setTimeout(() => {
      const idx = toasts.findIndex(t => t.id === id)
      if (idx !== -1) toasts.splice(idx, 1)
    }, duration)
  }

  return {
    toasts,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info'),
  }
}
