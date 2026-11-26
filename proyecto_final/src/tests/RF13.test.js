import { describe, it, expect } from 'vitest'
import { filtrarCitasPorPeriodo, calcularIngresos } from '../utils/reportes'

describe('RF13 - Reportes administrativos', () => {
  const fechaActual = new Date(2026, 10, 25)
  const citas = [
    { id: 1, fecha: '2026-11-25', estado: 'completada', monto: 150000 },
    { id: 2, fecha: '2026-11-20', estado: 'completada', monto: 200000 },
    { id: 3, fecha: '2026-10-15', estado: 'pendiente', monto: 100000 },
    { id: 4, fecha: '2026-11-10', estado: 'cancelada', monto: 50000 },
    { id: 5, fecha: '2025-11-25', estado: 'completada', monto: 300000 }
  ]

  it('RF13-01 filtra las citas del mes seleccionado', () => {
    const resultado = filtrarCitasPorPeriodo(citas, 'mes', fechaActual)
    expect(resultado).toHaveLength(3)
    expect(resultado.every(c => c.fecha.startsWith('2026-11'))).toBe(true)
  })

  it('RF13-02 filtra las citas del día seleccionado', () => {
    const resultado = filtrarCitasPorPeriodo(citas, 'dia', fechaActual)
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe(1)
  })

  it('RF13-03 filtra las citas del año seleccionado', () => {
    const resultado = filtrarCitasPorPeriodo(citas, 'anio', fechaActual)
    expect(resultado).toHaveLength(4)
  })

  it('RF13-04 muestra todas las citas en el histórico', () => {
    const resultado = filtrarCitasPorPeriodo(citas, 'historico', fechaActual)
    expect(resultado).toHaveLength(5)
  })

  it('RF13-05 calcula ingresos únicamente de citas completadas', () => {
    expect(calcularIngresos(citas)).toBe(650000)
  })

  it('RF13-06 devuelve cero cuando no hay citas completadas', () => {
    expect(calcularIngresos([
      { estado: 'pendiente', monto: 100000 },
      { estado: 'cancelada', monto: 50000 }
    ])).toBe(0)
  })
})
