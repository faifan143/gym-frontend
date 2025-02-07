import { RootState } from "@/cache/store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Search, User, Menu, Dumbbell, Timer, Activity, Flame } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ManagerHeaderProps {
  activeTab: string;
  tabs: [];
  isMobile: boolean;
  onMobileToggle: () => void;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const HeaderSearchBox = ({
  activeTab,
  searchQuery,
  setSearchQuery,
}: {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative flex-1 max-w-xl mx-auto"
      initial={false}
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`relative flex items-center rounded-xl 
        ${
          isFocused
            ? "bg-white shadow-lg ring-1 ring-gray-200"
            : "bg-gray-50 hover:bg-white shadow-sm"
        } 
        backdrop-blur-sm transition-all duration-300`}
      >
        <Search className={`w-5 h-5 mr-3 ${isFocused ? "text-gray-600" : "text-gray-400"}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`ابحث عن ${
            activeTab === "trainers"
              ? "المدربين"
              : activeTab === "nutritionists"
              ? "أخصائيي التغذية"
              : activeTab === "classes"
              ? "الحصص"
              : "الخطط"
          }...`}
          className="w-full py-3 pr-2 pl-4 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className={`mr-auto pl-3 pr-2 py-1 border-r border-gray-200 transition-opacity duration-300 ${isFocused ? "opacity-100" : "opacity-50"}`}>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
            <span className="text-xs">⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>
    </motion.div>
  );
};

export function ManagerHeader({
  activeTab,
  tabs,
  isMobile,
  onMobileToggle,
  setActiveTab,
  onLogout,
  searchQuery,
  setSearchQuery,
}: ManagerHeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const profileImage = useSelector((state: RootState) => state.user.photo);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white sticky top-0 z-40 shadow-sm"
    >
      {/* Top Bar - Gym Timer */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-1.5 flex items-center justify-between text-gray-600 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-blue-500" />
            <span>{time.toLocaleTimeString('ar-EG')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700 font-medium">وقت النشاط</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-gray-700" />
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-gray-800">مركز القوة للياقة البدنية</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4 flex items-center justify-between gap-4 bg-white border-b border-gray-100">
        <div className="w-40">
          {isMobile && (
            <button
              onClick={onMobileToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-800">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>

        {/* Centered Search Box */}
        {(activeTab === "trainers" ||
          activeTab === "nutritionists" ||
          activeTab === "plans" ||
          activeTab === "classes") && (
          <div className="flex-1 max-w-3xl mx-auto px-4">
            <HeaderSearchBox
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-colors">
              <img
                src={profileImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
          </motion.button>

          <AnimatePresence>
            {isMegaMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setIsMegaMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-right"
                  >
                    <User className="w-4 h-4" />
                    <span>الملف الشخصي</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMegaMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-right"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};