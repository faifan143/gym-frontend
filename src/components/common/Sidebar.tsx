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
      className={`fixed top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-xl border-l border-slate-200 z-50 
            ${isMobile ? "transform transition-transform duration-300" : ""}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">لوحة التحكم</h1>
        </div>

        <nav className="space-y-2">
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
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
