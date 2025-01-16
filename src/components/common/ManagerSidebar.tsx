import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";

const ManagerSidebar = ({ activeTab, setActiveTab, tabs, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <Dumbbell className="h-8 w-8 text-blue-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              لوحة التحكم المدير
            </h1>
            <p className="text-sm text-gray-500">مرحباً بك في النظام</p>
          </div>
        </motion.div>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all relative group ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-blue-50"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
              <div className="relative flex items-center gap-3 z-10">
                <tab.icon
                  className={`h-5 w-5 transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-700 group-hover:text-blue-500"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>النظام يعمل بشكل طبيعي</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 bg-white h-screen fixed border-l shadow-lg">
          {sidebarContent}
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagerSidebar;
