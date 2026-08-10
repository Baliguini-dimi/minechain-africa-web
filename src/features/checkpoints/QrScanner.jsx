import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QrScanner({ onScan, isActive }) {
  const containerRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const scanner = new Html5Qrcode('qr-scanner-container')
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText)
          scanner.stop().catch(() => {})
        },
        () => {
          // erreur de lecture frame par frame, ignorée volontairement (bruit normal du scan)
        }
      )
      .catch(() => {
        // caméra inaccessible (permission refusée, pas de caméra, etc.)
      })

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [isActive, onScan])

  if (!isActive) return null

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div id="qr-scanner-container" ref={containerRef} className="w-full" />
    </div>
  )
}