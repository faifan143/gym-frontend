// pages/customer/index.tsx
"use client";

import CustomersClassesTab from "@/components/common/CustomersClassesTab";
import CustomersGeneralTab from "@/components/common/CustomersGeneral";
import CustomersPlansTab from "@/components/common/CustomersPlansTab";
import GymBackground from "@/components/common/GymBackground";
import ProfileTab from "@/components/common/ProfileTab";
import {
  useMyClasses,
  useMyPlans,
  useMySubscription,
} from "@/hooks/useCustomer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CreditCard,
  Dumbbell,
  Home,
  Menu,
  PersonStanding,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const CustomerHeader = ({ activeTab, tabs }) => {
  return (
    <header className="bg-white border-b" dir="rtl">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-16 px-8">
          {/* Left Section - Title and Breadcrumb */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
            </motion.div>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="text-sm text-gray-500">
              الرئيسية / {tabs.find((tab) => tab.id === activeTab)?.label}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const CustomerSidebar = ({ activeTab, setActiveTab, tabs, isMobile }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);

  const sidebarContent = (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b relative">
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(false)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        )}
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
              لوحة تحكم الزبون
            </h1>
            <p className="text-sm text-gray-500">مرحباً بك في النظام</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </motion.button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 bg-white h-screen fixed border-l shadow-lg">
          {sidebarContent}
        </div>
      )}

      {/* Mobile Sidebar with Overlay */}
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
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl overflow-hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomerDashboard = () => {
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

  const tabs = [
    { id: "general", label: "عام", icon: Home },
    ...(hasClasses > 0
      ? [{ id: "classes", label: "الحصص", icon: Calendar }]
      : []),
    ...(hasClasses > 0
      ? [{ id: "plans", label: "الخطط", icon: CreditCard }]
      : []),
    { id: "profile", label: "الحساب", icon: PersonStanding },
  ];

  const [activeTab, setActiveTab] = useState("general");
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <GymBackground />
      <CustomerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        tabs={tabs}
      />
      <div className={`flex-1 ${isMobile ? "p-0" : "pl-64"}`} dir="rtl">
        <CustomerHeader activeTab={activeTab} isMobile={isMobile} tabs={tabs} />
        {activeTab === "general" && <CustomersGeneralTab />}
        {activeTab === "classes" && (
          <CustomersClassesTab isSubscribed={mySubscription.subscription} />
        )}
        {activeTab === "plans" && (
          <CustomersPlansTab isSubscribed={mySubscription.subscription} />
        )}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default CustomerDashboard;
