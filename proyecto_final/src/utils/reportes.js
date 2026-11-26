export function filtrarCitasPorPeriodo(citas, periodo, fechaActual = new Date()) {
  return citas.filter(c => {
    if (!c.fecha) return false

    const fechaCita = new Date(c.fecha + 'T00:00:00')
    if (Number.isNaN(fechaCita.getTime())) return false

    if (periodo === 'dia') {
      return fechaCita.toDateString() === fechaActual.toDateString()
    }

    if (periodo === 'mes') {
      return fechaCita.getMonth() === fechaActual.getMonth() &&
        fechaCita.getFullYear() === fechaActual.getFullYear()
    }

    if (periodo === 'anio') {
      return fechaCita.getFullYear() === fechaActual.getFullYear()
    }

    if (periodo === 'semana') {
      const diferencia = fechaActual - fechaCita
      return diferencia >= 0 && diferencia < 7 * 24 * 60 * 60 * 1000
    }

    return true
  })
}

export function calcularIngresos(citas) {
  return citas
    .filter(c => c.estado === 'completada')
    .reduce((total, c) => total + (Number(c.monto) || 0), 0)
}
