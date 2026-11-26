export async function obtenerEstadisticasDashboard(apiBaseUrl, headers, request = fetch) {
  const respuesta = await request(`${apiBaseUrl}/admin/stats`, { headers })

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las estadísticas')
  }

  return await respuesta.json()
}
