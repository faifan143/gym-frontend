import { motion } from "framer-motion";
import { Dumbbell, LucideIcon } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  tabs: {
    id: string;
    label: string;
    icon: LucideIcon;
    gradient: string;
  }[];
}

const Sidebar = ({ activeTab, setActiveTab, isMobile, tabs }: SidebarProps) => {
  return (
    <motion.div
      initial={isMobile ? { x: -280 } : false}
      animate={isMobile ? { x: 0 } : false}
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 
            ${isMobile ? "transform transition-transform duration-300" : ""}`}
    >
      {/* Gym Equipment Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.07] pointer-events-none">
        <div className="absolute top-20 right-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="2" />
            <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute top-40 left-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12h16M8 8v8M16 8v8"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute bottom-20 left-6">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v16M8 8l8 8M16 8l-8 8"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="relative h-full flex flex-col p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <span className="text-xs text-gray-500">مركز اللياقة البدنية</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                    : "text-gray-600 hover:bg-gray-100/80"
                }`}
            >
              <div
                className={`relative ${
                  activeTab === tab.id ? "animate-bounce" : ""
                }`}
              >
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{tab.label}</span>

              {/* Active Indicator */}
              {activeTab === tab.id && (
                <div className="mr-auto relative w-2 h-2">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-white rounded-full" />
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Motivational Quote */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <p className="text-sm text-gray-600 text-center">
              {"القوة تأتي من تجاوز الحدود التي ظننت أنها نهايتك"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
