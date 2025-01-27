// components/common/ManagerHeader.tsx
"use client";

import { RootState } from "@/cache/store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Search, User, Menu } from "lucide-react";
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
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative flex items-center rounded-xl 
        ${
          isFocused
            ? "bg-white shadow-lg ring-1 ring-purple-500/50"
            : "bg-slate-100/50 hover:bg-white/70 shadow"
        } 
        backdrop-blur-sm transition-all duration-300`}
      >
        <Search
          className={`w-5 h-5 mr-3 transition-colors duration-300 
          ${isFocused ? "text-purple-500" : "text-slate-400"}`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`ابحث عن ${
            activeTab === "trainers" ? "المدربين" : "أخصائيي التغذية"
          }...`}
          className="w-full py-3 pr-2 pl-4 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={`mr-auto pl-3 pr-2 py-1 border-r border-slate-200/50 
          transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-50"
          }`}
        >
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded">
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

  const profileImage = useSelector((state: RootState) => state.user.photo);

  console.log("profile image: " + profileImage);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Focus the search input
        const searchInput = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
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
      className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40"
    >
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="w-40">
          {" "}
          {/* Fixed width for left side */}
          {isMobile && (
            <button
              onClick={onMobileToggle}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          )}
          <h2 className="text-xl font-bold text-slate-800">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>

        {/* Centered Search Box */}
        {(activeTab === "trainers" || activeTab === "nutritionists") && (
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-colors group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-colors">
              <img
                src={profileImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 
                ${isMegaMenuOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence>
            {isMegaMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setIsMegaMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-right"
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
}
