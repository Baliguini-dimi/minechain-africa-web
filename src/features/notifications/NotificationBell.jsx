import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from './useNotifications'

const TYPE_LABELS = {
  lot_expedie: 'a été expédié',
  lot_livre: 'a été livré',
  anomalie_signalee: 'a une anomalie signalée',
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  return `il y a ${Math.floor(diffH / 24)} j`
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const { data } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = data?.data ?? []
  const unreadCount = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleClick(notification) {
    if (!notification.read_at) markAsRead.mutate(notification.id)
    if (notification.payload?.lot_id) {
      navigate(`/lots/${notification.payload.lot_id}`)
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded border border-border text-text-secondary hover:text-text-primary transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-anomaly text-white text-[10px] flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-20">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-body text-xs font-medium text-text-secondary uppercase tracking-wide">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                className="text-xs font-body text-accent hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center font-body text-sm text-text-secondary">
              Aucune notification.
            </p>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`w-full text-left px-4 py-3 hover:bg-bg/50 transition-colors ${
                    !notification.read_at ? 'bg-accent/5' : ''
                  }`}
                >
                  <p className="font-body text-sm text-text-primary">
                    Lot{' '}
                    <span className="font-mono text-accent">
                      {notification.payload?.lot_uuid?.slice(0, 8)}
                    </span>{' '}
                    {TYPE_LABELS[notification.type] ?? notification.type}
                  </p>
                  <p className="font-mono text-xs text-text-secondary mt-0.5">
                    {timeAgo(notification.created_at)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}