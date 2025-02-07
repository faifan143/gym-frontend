"use client";

import { logout } from "@/cache/slices/userSlice";
import { AppDispatch } from "@/cache/store";
import CreateNutritionistModal from "@/components/common/CreateNutritionistModal";
import CreateSpecialtyModal from "@/components/common/CreateSpecialtyModal";
import CreateSubscriptionModal from "@/components/common/CreateSubscriptionModal";
import CreateTrainerModal from "@/components/common/CreateTrainerModal";
import GymBackground from "@/components/common/GymBackground";
import GymBackground2 from "@/components/common/GymBackground2";
import { ManagerHeader } from "@/components/common/HeaderSearchBox";
import Overview from "@/components/common/ManagerOverview";
import NutritionistsTab from "@/components/common/NutritionistsTab";
import ProfileTab from "@/components/common/ProfileTab";
import Sidebar from "@/components/common/Sidebar";
import SubscriptionsTab from "@/components/common/SubscriptionsTab";
import TrainersTab from "@/components/common/TrainersTab";
import { useMokkBar } from "@/components/providers/Mokkbar";
import {
  useDetachCustomerExpired,
  useDetachExpired,
  useExpiredSubscriptionsReport,
  useManagerCustomers,
  useManagerNutritionists,
  useManagerSpecialties,
  useManagerTrainers,
} from "@/hooks/useManager";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, CreditCard, Dumbbell, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
export const tabs = [
  {
    id: "overview",
    label: "نظرة عامة",
    icon: Activity,
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "trainers",
    label: "المدربين",
    icon: Dumbbell,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    id: "nutritionists",
    label: "أخصائيي التغذية",
    icon: Utensils,
    gradient: "from-orange-600 to-amber-600",
  },
  {
    id: "subscriptions",
    label: "الاشتراكات",
    icon: CreditCard,
    gradient: "from-violet-600 to-purple-600",
  },
];

const ManagerDashboard = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isNeutritionModalOpen, setIsNeutritionModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: expiredSubscriptions } = useExpiredSubscriptionsReport();
  const { data: managerCustomers } = useManagerCustomers();
  const { data: managerTrainers } = useManagerTrainers();
  const { data: managerNeutritionists } = useManagerNutritionists();
  const { data: managerSpecialties } = useManagerSpecialties();
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const {
    mutateAsync: detachedCustomerExpired,
    isPending: isCustomerDetaching,
  } = useDetachCustomerExpired({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manager", "expired-subscriptions-report"],
      });
      queryClient.refetchQueries({
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
  const handleCustomerDetachExpired = async (customerId: string) => {
    try {
      await detachedCustomerExpired(customerId);
    } catch (error) {
      console.error("Error detaching expired subscriptions:", error);
    }
  };

  const handleModalClose = (modalSetter: (value: boolean) => void) => {
    modalSetter(false);
    queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "nutritionists"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "specialties"] });
  };

  const handleLogout = () => {
    setSnackbarConfig({
      open: true,
      severity: "info",
      message: "تم تسجيل الخروج بنجاح",
    });
    queryClient.resetQueries();
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <GymBackground />

      {/* Content Wrapper */}
      <div className="relative flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          isMobile={isMobile}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isMobile ? "pr-0" : "pr-64"
          }`}
          dir="rtl"
        >
          {/* Header */}
          <ManagerHeader
            activeTab={activeTab}
            tabs={tabs}
            isMobile={isMobile}
            onMobileToggle={() => setIsMobile(!isMobile)}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Content Area */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "overview" && (
                  <Overview
                    expiredSubscriptions={expiredSubscriptions}
                    handleDetachExpired={handleDetachExpired}
                    isDetaching={isDetaching}
                    managerCustomers={managerCustomers}
                    managerTrainers={managerTrainers}
                    managerNeutritionists={managerNeutritionists}
                    managerSpecialties={managerSpecialties}
                    setIsTrainerModalOpen={setIsTrainerModalOpen}
                    setIsNeutritionModalOpen={setIsNeutritionModalOpen}
                    setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
                    setIsSpecialtyModalOpen={setIsSpecialtyModalOpen}
                    handleDetachCustomer={handleCustomerDetachExpired}
                    isCustomerDetaching={isCustomerDetaching}
                  />
                )}
                {activeTab === "trainers" && (
                  <TrainersTab searchQuery={searchQuery} />
                )}
                {activeTab === "nutritionists" && (
                  <NutritionistsTab searchQuery={searchQuery} />
                )}
                {activeTab === "subscriptions" && <SubscriptionsTab />}
                {activeTab === "profile" && <ProfileTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {isTrainerModalOpen && (
          <CreateTrainerModal
            isOpen={isTrainerModalOpen}
            onClose={() => handleModalClose(setIsTrainerModalOpen)}
          />
        )}
        {isNeutritionModalOpen && (
          <CreateNutritionistModal
            isOpen={isNeutritionModalOpen}
            onClose={() => handleModalClose(setIsNeutritionModalOpen)}
          />
        )}
        {isSubscriptionModalOpen && (
          <CreateSubscriptionModal
            isOpen={isSubscriptionModalOpen}
            onClose={() => handleModalClose(setIsSubscriptionModalOpen)}
          />
        )}
        {isSpecialtyModalOpen && (
          <CreateSpecialtyModal
            isOpen={isSpecialtyModalOpen}
            onClose={() => handleModalClose(setIsSpecialtyModalOpen)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagerDashboard;
