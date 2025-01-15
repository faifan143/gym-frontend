// components/common/CustomersGeneralTab.tsx
import {
  useAllSubscriptions,
  useMyClasses,
  useMyPlans,
  useMySubscription,
} from "@/hooks/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, CreditCard, Plus } from "lucide-react";
import React from "react";
import SubscribeModal from "./SubscribeModal";
import { useMokkBar } from "../providers/Mokkbar";

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
    <div className="p-6 space-y-6">
      {/* Subscription Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {mySubscription && mySubscription.subscription ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium 
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
                {
                  <p className="text-gray-500">
                    ينتهي في{" "}
                    {new Date(mySubscription?.endDate).toLocaleDateString("ar")}
                  </p>
                }
              </div>
              <div className="text-xl font-bold">
                {mySubscription.subscription.cost} ليرة
              </div>
            </div>

            {myClasses && myPlans ? (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Available Classes */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-medium">
                    الحصص المتبقية
                  </div>
                  <div className="text-2xl font-bold">
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
                </div>

                {/* Available Plans */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-medium">
                    الخطط المتبقية
                  </div>
                  <div className="text-2xl font-bold">
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
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              لا يوجد اشتراك نشط
            </h3>
            <p className="text-gray-500">قم بالاشتراك للوصول إلى الخدمات</p>
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              اشترك الآن
            </button>
          </div>
        )}
      </div>

      {/* Enrolled Services */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Classes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">الحصص المشترك بها</h3>
            <Calendar className="text-blue-500" />
          </div>
          <div className="space-y-3">
            {myClasses && myClasses.length ? (
              myClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{cls.name}</span>
                  <div className="text-sm text-gray-500">
                    {cls.schedule[0].day} - {cls.schedule[0].time}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                لا توجد حصص مشترك بها
              </p>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">الخطط المشترك بها</h3>
            <CreditCard className="text-green-500" />
          </div>
          <div className="space-y-3">
            {myPlans?.length ? (
              myPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <span className="font-medium">{plan.title}</span>
                  <div className="text-sm text-gray-500">
                    {plan.nutritionist.user.name}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                لا توجد خطط مشترك بها
              </p>
            )}
          </div>
        </div>
      </div>

      {showSubscribeModal && (
        <SubscribeModal
          subscriptions={(availableSubscriptions as any[]) ?? []}
          onClose={handleSubscribeModalClose}
          onSuccess={handleSubscriptionSuccess}
          onError={handleSubscriptionError}
          isOpen={showSubscribeModal}
        />
      )}

      {selectedPlan && (
        <PlanDetailsModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default CustomersGeneralTab;

const PlanDetailsModal = ({ plan, isOpen, onClose }) => {
  if (!isOpen || !plan) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative h-[90%] overflow-y-auto overflow-hidden no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4  text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold my-4">{plan.title}</h3>
        <p className="text-gray-700 whitespace-pre-line">{plan.planDetails}</p>
      </div>
    </div>
  );
};
