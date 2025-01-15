// pages/trainer/index.tsx
"use client";

import PlansTab from "@/components/common/PlansTab";
import ProfileTab from "@/components/common/ProfileTab";
import { Dumbbell, Map, PersonStandingIcon } from "lucide-react";
import { useState } from "react";

const TrainerDashboard = () => {
  const tabs = [
    { id: "plans", label: "الخطط", icon: Map },
    { id: "profile", label: "الحساب", icon: PersonStandingIcon },
  ];
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm h-screen fixed">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Dumbbell className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-64" dir="rtl">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-2xl font-semibold">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
          </div>
        </header>

        {activeTab === "plans" && <PlansTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default TrainerDashboard;
