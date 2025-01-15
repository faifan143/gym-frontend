"use client";

import CreateNutritionistModal from "@/components/common/CreateNutritionistModal";
import CreateSpecialtyModal from "@/components/common/CreateSpecialtyModal";
import CreateSubscriptionModal from "@/components/common/CreateSubscriptionModal";
import CreateTrainerModal from "@/components/common/CreateTrainerModal";
import NutritionistsTab from "@/components/common/NutritionistsTab";
import ProfileTab from "@/components/common/ProfileTab";
import SubscriptionsTab from "@/components/common/SubscriptionsTab";
import TrainersTab from "@/components/common/TrainersTab";
import { useMokkBar } from "@/components/providers/Mokkbar";
import {
  useDetachExpired,
  useExpiredSubscriptionsReport,
  useManagerCustomers,
  useManagerNutritionists,
  useManagerSpecialties,
  useManagerTrainers,
} from "@/hooks/useManager";
import { formatDate } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CreditCard,
  Dumbbell,
  PersonStandingIcon,
  PlusCircle,
  TrendingUp,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
const tabs = [
  { id: "overview", label: "نظرة عامة", icon: TrendingUp },
  { id: "trainers", label: "المدربين", icon: Dumbbell },
  { id: "nutritionists", label: "أخصائيي التغذية", icon: Utensils },
  { id: "subscriptions", label: "الاشتراكات", icon: CreditCard },
  { id: "profile", label: "الحساب", icon: PersonStandingIcon },
];

const ManagerDashboard = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isNeutritionModalOpen, setIsNeutritionModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const { data: expiredSubscriptions } = useExpiredSubscriptionsReport();
  const { data: managerCustomers } = useManagerCustomers();
  const { data: managerTrainers } = useManagerTrainers();
  const { data: managerNeutritionists } = useManagerNutritionists();
  const { data: managerSpecialties } = useManagerSpecialties();

  const queryClient = useQueryClient();

  const { mutateAsync: detachedExpired, isPending: isDetaching } =
    useDetachExpired({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["manager", "expired-subscriptions-report"],
        });
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم إلغاء الاشتراكات المنتهية بنجاح",
        });
      },
      onError: (error) => {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message:
            error?.response?.data?.message ||
            "حدث خطأ أثناء إلغاء الاشتراكات المنتهية",
        });
      },
    });

  const handleDetachExpired = async () => {
    try {
      if (expiredSubscriptions?.count === 0) {
        setSnackbarConfig({
          open: true,
          severity: "info",
          message: "لا يوجد اشتراكات منتهية للإلغاء",
        });
        return;
      }

      await detachedExpired();
    } catch (error) {
      console.error("Error detaching expired subscriptions:", error);
    }
  };

  const handleModalClose = (modalSetter: (value: boolean) => void) => {
    modalSetter(false);
    // Refresh data after modal closes
    queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "nutritionists"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "specialties"] });
  };

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
      {
        <div className="flex-1 pl-64" dir="rtl">
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-8 py-4">
              <h2 className="text-2xl font-semibold">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
            </div>
          </header>
          {activeTab === "overview" && (
            <main className="p-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">عدد العملاء</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {managerCustomers?.length}
                      </h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">المدربين النشطين</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {managerTrainers?.length}
                      </h3>
                    </div>
                    <div className="bg-green-50 p-3 rounded-full">
                      <Dumbbell className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">أخصائيي التغذية</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {managerNeutritionists?.length}
                      </h3>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-full">
                      <Utensils className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">عدد الاختصاصات</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {managerSpecialties?.length || 0}
                      </h3>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setIsTrainerModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>إضافة مدرب</span>
                </button>
                <button
                  onClick={() => setIsNeutritionModalOpen(true)}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>إضافة أخصائي</span>
                </button>
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>إضافة اشتراك</span>
                </button>
                <button
                  onClick={() => setIsSpecialtyModalOpen(true)}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>إضافة تخصص</span>
                </button>
              </div>

              {/* Additional Info Sections */}
              <div className="grid grid-cols-1  gap-6">
                {/* Expired Subscriptions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Report Section */}

                    {/* Action Button */}
                    <div className="space-y-3">
                      {expiredSubscriptions?.count == 0 ? (
                        <div className="text-center text-gray-500">
                          لايوجد اشتراكات منتهية
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {expiredSubscriptions?.count > 0 && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    الاشتراكات المنتهية
                                  </h3>
                                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                                    {expiredSubscriptions?.count} منتهي
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  {expiredSubscriptions?.details.map(
                                    (subscription) => (
                                      <motion.div
                                        key={`${subscription.subscriptionId}-${subscription.customerId}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-gray-400" />
                                              <span className="font-medium text-gray-700">
                                                {subscription.customerName}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <CreditCard className="h-4 w-4 text-gray-400" />
                                              <span className="text-sm text-gray-600">
                                                {subscription.subscriptionLevel}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Clock className="h-4 w-4 text-gray-400" />
                                              <span className="text-sm text-gray-500">
                                                انتهى في:{" "}
                                                {formatDate(
                                                  subscription.endDate
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm text-gray-500">
                                              {subscription.customerEmail}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                              ID: {subscription.customerId}
                                            </span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={handleDetachExpired}
                            disabled={isDetaching}
                            className="bg-orange-400 hover:bg-orange-500 mt-4 py-2 px-4 rounded-md text-white transition-colors mx-auto w-1/3 disabled:bg-orange-300"
                          >
                            {isDetaching
                              ? "جاري إلغاء الاشتراكات..."
                              : "الغاء اشتراك جميع المستنفذين"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </main>
          )}

          {activeTab === "trainers" && <TrainersTab />}
          {activeTab === "nutritionists" && <NutritionistsTab />}
          {activeTab === "subscriptions" && <SubscriptionsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      }

      <CreateTrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => handleModalClose(setIsTrainerModalOpen)}
      />
      <CreateNutritionistModal
        isOpen={isNeutritionModalOpen}
        onClose={() => handleModalClose(setIsNeutritionModalOpen)}
      />
      <CreateSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => handleModalClose(setIsSubscriptionModalOpen)}
      />
      <CreateSpecialtyModal
        isOpen={isSpecialtyModalOpen}
        onClose={() => handleModalClose(setIsSpecialtyModalOpen)}
      />
    </div>
  );
};

export default ManagerDashboard;
