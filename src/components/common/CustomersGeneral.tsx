// components/common/CustomersGeneralTab.tsx
import {
  useAllSubscriptions,
  useMyClasses,
  useMyPlans,
  useMySubscription,
} from "@/hooks/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, CreditCard, Plus, X } from "lucide-react";
import React from "react";
import SubscribeModal from "./SubscribeModal";
import { useMokkBar } from "../providers/Mokkbar";
import { motion } from "framer-motion";
import { PlanDetailsModal } from "./CustomersPlansTab";

const CustomersGeneralTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const queryClient = useQueryClient();
  const { data: mySubscription } = useMySubscription();
  const { data: availableSubscriptions } = useAllSubscriptions();
  const { data: myClasses } = useMyClasses();
  const { data: myPlans } = useMyPlans();

  const [showSubscribeModal, setShowSubscribeModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(null);

  const handleSubscribeModalClose = () => {
    setShowSubscribeModal(false);

    queryClient.invalidateQueries({
      queryKey: ["customer", "my-plans"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "my-classes"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "my-subscription"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "all-plans"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "all-classes"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "all-subscriptions"],
    });
  };

  const handleSubscriptionSuccess = () => {
    setSnackbarConfig({
      open: true,
      severity: "success",
      message: "تم الاشتراك بنجاح",
    });
    handleSubscribeModalClose();
  };

  const handleSubscriptionError = (error: any) => {
    setSnackbarConfig({
      open: true,
      severity: "error",
      message: error?.response?.data?.message || "حدث خطأ أثناء الاشتراك",
    });
  };
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Subscription Status Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {mySubscription && mySubscription.subscription ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    mySubscription.subscription.level === "BASIC"
                      ? "bg-gray-100 text-gray-600"
                      : mySubscription.subscription.level === "VIP"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {mySubscription.subscription.level}
                </span>
                <p className="text-gray-500 text-sm">
                  ينتهي في{" "}
                  {new Date(mySubscription?.endDate).toLocaleDateString("ar")}
                </p>
              </div>
              <div className="text-xl font-bold">
                {mySubscription.subscription.cost} ليرة
              </div>
            </div>

            {myClasses && myPlans ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-50 p-4 rounded-xl"
                >
                  <div className="text-blue-600 font-medium">
                    الحصص المتبقية
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {mySubscription.subscription.level === "PREMIUM"
                      ? "غير محدود"
                      : Math.max(
                          0,
                          mySubscription.subscription.level === "BASIC"
                            ? 1 - myPlans?.length - myClasses?.length
                            : mySubscription.subscription.level === "VIP"
                            ? 2 - (myPlans?.length + myClasses?.length)
                            : 0
                        )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-green-50 p-4 rounded-xl"
                >
                  <div className="text-green-600 font-medium">
                    الخطط المتبقية
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {mySubscription.subscription.level === "PREMIUM"
                      ? "غير محدود"
                      : Math.max(
                          0,
                          mySubscription.subscription.level === "BASIC"
                            ? 1 - myPlans?.length - myClasses?.length
                            : mySubscription.subscription.level === "VIP"
                            ? 2 - (myPlans?.length + myClasses?.length)
                            : 0
                        )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              لا يوجد اشتراك نشط
            </h3>
            <p className="text-gray-500">قم بالاشتراك للوصول إلى الخدمات</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubscribeModal(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              اشترك الآن
            </motion.button>
          </div>
        )}
      </div>

      {/* Enrolled Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Classes Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">الحصص المشترك بها</h3>
            <Calendar className="text-blue-500" />
          </div>
          <div className="space-y-3">
            {myClasses && myClasses.length ? (
              myClasses.map((cls) => (
                <motion.div
                  key={cls.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl gap-2"
                >
                  <span className="font-medium">{cls.name}</span>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock size={16} />
                    {cls.schedule[0].day} - {cls.schedule[0].time}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                لا توجد حصص مشترك بها
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">الخطط المشترك بها</h3>
            <CreditCard className="text-green-500" />
          </div>
          <div className="space-y-3">
            {myPlans?.length ? (
              myPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedPlan(plan)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl gap-2 cursor-pointer"
                >
                  <span className="font-medium">{plan.title}</span>
                  <div className="text-sm text-gray-500">
                    {plan.nutritionist.user.name}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                لا توجد خطط مشترك بها
              </div>
            )}
          </div>
        </div>
        {selectedPlan && (
          <PlanDetailsModal
            isEnrolling={false}
            onEnroll={() => {}}
            selectedPlan={selectedPlan}
            showDetails={true}
            onClose={() => setSelectedPlan(null)}
          />
        )}
        {showSubscribeModal && (
          <SubscribeModal
            subscriptions={(availableSubscriptions as any[]) ?? []}
            onClose={handleSubscribeModalClose}
            onSuccess={handleSubscriptionSuccess}
            onError={handleSubscriptionError}
            isOpen={showSubscribeModal}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersGeneralTab;
