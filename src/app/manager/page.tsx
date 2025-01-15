"use client";

import CreateNutritionistModal from "@/components/common/CreateNutritionistModal";
import CreateSpecialtyModal from "@/components/common/CreateSpecialtyModal";
import CreateSubscriptionModal from "@/components/common/CreateSubscriptionModal";
import CreateTrainerModal from "@/components/common/CreateTrainerModal";
import GymBackground from "@/components/common/GymBackground";
import ManagerHeader from "@/components/common/ManagerHeader";
import Overview from "@/components/common/ManagerOverview";
import ManagerSidebar from "@/components/common/ManagerSidebar";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Dumbbell,
  PersonStandingIcon,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  const { data: expiredSubscriptions } = useExpiredSubscriptionsReport();
  const { data: managerCustomers } = useManagerCustomers();
  const { data: managerTrainers } = useManagerTrainers();
  const { data: managerNeutritionists } = useManagerNutritionists();
  const { data: managerSpecialties } = useManagerSpecialties();

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
    queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "nutritionists"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
    queryClient.invalidateQueries({ queryKey: ["manager", "specialties"] });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ManagerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        isMobile={isMobile}
      />
      <GymBackground />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "pr-0" : "pl-64"
        }`}
        dir="rtl"
      >
        <ManagerHeader activeTab={activeTab} tabs={tabs} />
        <div className={`${isMobile ? "px-4" : "px-8"}`}>
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
            />
          )}

          {activeTab === "trainers" && <TrainersTab />}
          {activeTab === "nutritionists" && <NutritionistsTab />}
          {activeTab === "subscriptions" && <SubscriptionsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>

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
