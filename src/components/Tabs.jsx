import { useState } from 'react'

export default function Tabs({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key)

  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content

  return (
    <div>
      <div className="border-b border-border flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 font-body text-sm border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-accent border-accent font-medium'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            {tab.icon && <tab.icon size={15} />}
            {tab.label}
            {tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-status-anomaly text-white text-[11px] leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {activeContent}
    </div>
  )
}