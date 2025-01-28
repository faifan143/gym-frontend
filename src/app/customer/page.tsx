"use client";

import { logout } from "@/cache/slices/userSlice";
import { AppDispatch } from "@/cache/store";
import CustomersClassesTab from "@/components/common/CustomersClassesTab";
import CustomersGeneralTab from "@/components/common/CustomersGeneral";
import CustomersPlansTab from "@/components/common/CustomersPlansTab";
import GymBackground from "@/components/common/GymBackground";
import { ManagerHeader } from "@/components/common/HeaderSearchBox";
import ProfileTab from "@/components/common/ProfileTab";
import Sidebar from "@/components/common/Sidebar";
import {
  useMyClasses,
  useMyPlans,
  useMySubscription,
} from "@/hooks/useCustomer";
import { Calendar, CreditCard, Home, PersonStanding } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CustomerDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { data: myClasses } = useMyClasses();
  const { data: myPlans } = useMyPlans();
  const { data: mySubscription } = useMySubscription();

  // Check if the customer has any enrolled classes or plans
  const hasClasses = mySubscription?.subscription
    ? mySubscription?.subscription.level === "BASIC"
      ? myClasses?.length + myPlans?.length < 1
      : mySubscription?.subscription.level === "VIP"
      ? myClasses?.length + myPlans?.length < 2
      : 1
    : 1;

  // Dynamic tabs based on subscription status
  const tabs = [
    {
      id: "general",
      label: "عام",
      icon: Home,
      gradient: "from-blue-600 to-indigo-600",
    },
    ...(hasClasses > 0
      ? [
          {
            id: "classes",
            label: "الحصص",
            icon: Calendar,
            gradient: "from-emerald-600 to-teal-600",
          },
        ]
      : []),
    ...(hasClasses > 0
      ? [
          {
            id: "plans",
            label: "الخطط",
            icon: CreditCard,
            gradient: "from-violet-600 to-purple-600",
          },
        ]
      : []),
    {
      id: "profile",
      label: "الحساب",
      icon: PersonStanding,
      gradient: "from-orange-600 to-amber-600",
    },
  ];

  useEffect(() => {
    if (hasClasses == 0 && (activeTab == "classes" || activeTab == "plans")) {
      setActiveTab("general");
    }
  }, [activeTab, hasClasses]);

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

      {/* Sidebar */}
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
          {activeTab === "general" && <CustomersGeneralTab />}
          {activeTab === "classes" && (
            <CustomersClassesTab
              isSubscribed={mySubscription.subscription}
              searchQuery={searchQuery}
            />
          )}
          {activeTab === "plans" && (
            <CustomersPlansTab
              isSubscribed={mySubscription.subscription}
              searchQuery={searchQuery}
            />
          )}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
