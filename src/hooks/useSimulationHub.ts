/// <reference types="vite/client" />
import { useEffect, useRef, useState, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'
import type { SimStep } from '@/types'

export type HubStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface SimulationStep {
  svc: string
  label: string
  type: SimStep['type']
  delayMs: number
  stepIndex: number
  totalSteps: number
}

interface SimulationMetrics {
  latency: number
  throughput: number
  errors: number
  health: number
}

interface UseSimulationHubOptions {
  url?: string
  onStep?: (step: SimulationStep) => void
  onComplete?: (metrics: SimulationMetrics) => void
  onCancelled?: () => void
}

export function useSimulationHub({
  url = import.meta.env.VITE_SIGNALR_URL ?? 'http://localhost:5000',
  onStep,
  onComplete,
  onCancelled,
}: UseSimulationHubOptions = {}) {
  const connRef = useRef<signalR.HubConnection | null>(null)
  const [status, setStatus] = useState<HubStatus>('disconnected')

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${url}/hubs/simulation`)
      .withAutomaticReconnect([0, 1000, 3000, 5000])
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    conn.onreconnecting(() => setStatus('connecting'))
    conn.onreconnected(() => setStatus('connected'))
    conn.onclose(() => setStatus('disconnected'))

    conn.on('SimulationStep', (step: SimulationStep) => onStep?.(step))
    conn.on('SimulationComplete', ({ metrics }: { metrics: SimulationMetrics }) => onComplete?.(metrics))
    conn.on('SimulationCancelled', () => onCancelled?.())

    setStatus('connecting')
    conn
      .start()
      .then(() => setStatus('connected'))
      .catch(() => setStatus('error'))

    connRef.current = conn

    return () => {
      conn.stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const startSimulation = useCallback(
    (archId: string, scenarioId: string, speed = 1.0) => {
      connRef.current?.invoke('StartSimulation', archId, scenarioId, speed)
    },
    []
  )

  const cancelSimulation = useCallback(() => {
    connRef.current?.invoke('CancelSimulation')
  }, [])

  return { status, startSimulation, cancelSimulation }
}
