"use client"

import { useEffect } from "react"
import { useImageConverter } from "@/contexts/ImageConverterContext"
import { Toast } from "@/components/ui/toast"

export default function NotificationToast() {
  const { state, dispatch } = useImageConverter()

  useEffect(() => {
    state.toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: toast.id })
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [state.toasts, dispatch])

  const handleClose = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" role="region" aria-live="polite" aria-label="Notificações">
      {state.toasts.map((toast) => (
        <div key={toast.id} className="animate-in slide-in-from-right-full duration-300">
          <Toast toast={toast} onClose={handleClose} />
        </div>
      ))}
    </div>
  )
}
