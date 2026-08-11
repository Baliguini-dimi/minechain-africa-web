import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QrScanner({ onScan, isActive }) {
  useEffect(() => {
    if (!isActive) return

    const containerId = 'qr-scanner-container'
    const container = document.getElementById(containerId)
    if (container) container.innerHTML = ''

    const scanner = new Html5Qrcode(containerId)
    let hasScanned = false

    const startPromise = scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        if (hasScanned) return
        hasScanned = true
        scanner
          .stop()
          .catch(() => {})
          .finally(() => onScan(decodedText))
      },
      () => {
        // bruit normal du scan frame par frame, ignoré volontairement
      }
    )

    return () => {
      startPromise
        .then(() => {
          if (!hasScanned) {
            return scanner.stop()
          }
        })
        .catch(() => {})
        .finally(() => {
          if (container) container.innerHTML = ''
        })
    }
  }, [isActive, onScan])

  if (!isActive) return null

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div id="qr-scanner-container" className="w-full" />
    </div>
  )
}