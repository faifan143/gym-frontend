import { useMakePayment } from "@/hooks/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, CreditCard, X } from "lucide-react";
import React from "react";
import { useMokkBar } from "../providers/Mokkbar";

interface Subscription {
  id: number;
  level: "BASIC" | "VIP" | "PREMIUM";
  duration: "MONTHLY" | "QUARTERLY" | "ANNUAL";
  cost: number;
}

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const levelTranslations = {
  BASIC: "أساسي",
  VIP: "VIP",
  PREMIUM: "بريميوم",
};

const durationTranslations = {
  MONTHLY: "شهري",
  QUARTERLY: "ربع سنوي",
  ANNUAL: "سنوي",
};

const SubscribeModal = ({
  isOpen,
  onClose,
  subscriptions,
  onSuccess,
  onError,
}: SubscribeModalProps) => {
  const { setSnackbarConfig } = useMokkBar();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = React.useState<number | null>(null);

  const makePaymentMutation = useMakePayment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer", "my-subscription"],
      });
      queryClient.refetchQueries({
        queryKey: ["customer", "my-subscription"],
      });

      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم الاشتراك بنجاح",
      });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء الاشتراك",
      });
      onError?.(error);
    },
  });

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "الرجاء اختيار خطة اشتراك",
      });
      return;
    }

    try {
      await makePaymentMutation.mutateAsync({
        subscriptionId: selectedPlan.toString(),
      });
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  const handleClose = () => {
    if (makePaymentMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "جاري تنفيذ عملية الاشتراك، يرجى الانتظار",
      });
      return;
    }
    setSelectedPlan(null);
    onClose();
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full overflow-y-auto no-scrollbar overflow-hidden  h-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">اختر خطة الاشتراك</h2>
            <button
              onClick={handleClose}
              disabled={makePaymentMutation.isPending}
              className="text-gray-400 hover:text-gray-500 disabled:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <motion.div
                key={subscription.id}
                whileHover={{ scale: makePaymentMutation.isPending ? 1 : 1.02 }}
                onClick={() => {
                  if (!makePaymentMutation.isPending) {
                    setSelectedPlan(subscription.id);
                  }
                }}
                className={`p-6 rounded-xl border-2 transition-colors ${
                  makePaymentMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  selectedPlan === subscription.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                      ${
                        subscription.level === "BASIC"
                          ? "bg-gray-100 text-gray-600"
                          : subscription.level === "VIP"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                  >
                    {levelTranslations[subscription.level]}
                  </span>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold">{subscription.cost} ليرة</p>
                  <p className="text-gray-500">
                    {durationTranslations[subscription.duration]}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {subscription.level === "BASIC" && (
                    <>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>كورس واحد</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>خطة واحدة</span>
                      </li>
                    </>
                  )}
                  {subscription.level === "VIP" && (
                    <>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>حصتين</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>خطتين</span>
                      </li>
                    </>
                  )}
                  {subscription.level === "PREMIUM" && (
                    <>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>حصص غير محدودة</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span>خطط غير محدودة</span>
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              disabled={makePaymentMutation.isPending}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 disabled:text-gray-400 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubscribe}
              disabled={!selectedPlan || makePaymentMutation.isPending}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors ${
                !selectedPlan || makePaymentMutation.isPending
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <CreditCard size={18} />
              {makePaymentMutation.isPending
                ? "جاري الاشتراك..."
                : "اشترك الآن"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubscribeModal;
