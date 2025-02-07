"use client";

import { logout } from "@/cache/slices/userSlice";
import { AppDispatch } from "@/cache/store";
import ClassesTab from "@/components/common/ClassManagementTab";
import GymBackground from "@/components/common/GymBackground";
import { ManagerHeader } from "@/components/common/HeaderSearchBox";
import ProfileTab from "@/components/common/ProfileTab";
import Sidebar from "@/components/common/Sidebar";
import { BookOpen, PersonStandingIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const TrainerDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("classes");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const tabs = [
    {
      id: "classes",
      label: "الحصص",
      icon: BookOpen,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      id: "profile",
      label: "الحساب",
      icon: PersonStandingIcon,
      gradient: "from-emerald-600 to-teal-600",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMobileToggle = () => {
    setIsMobile(!isMobile);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <GymBackground />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "pr-0" : "pr-64"
        }`}
        dir="rtl"
      >
        <ManagerHeader
          activeTab={activeTab}
          tabs={tabs}
          isMobile={isMobile}
          onMobileToggle={handleMobileToggle}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className={`${isMobile ? "px-4" : "px-8"} py-6`}>
          {activeTab === "classes" && <ClassesTab searchQuery={searchQuery} />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
