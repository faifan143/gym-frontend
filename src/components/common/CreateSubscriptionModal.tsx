import { useCreateSubscription } from "@/hooks/useManager";
import { SubscriptionDuration, SubscriptionLevel } from "@/types/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { useMokkBar } from "../providers/Mokkbar";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const levelTranslations = {
  [SubscriptionLevel.BASIC]: "أساسي",
  [SubscriptionLevel.VIP]: "VIP",
  [SubscriptionLevel.PREMIUM]: "بريميوم",
};

const durationTranslations = {
  [SubscriptionDuration.MONTHLY]: "شهري",
  [SubscriptionDuration.QUARTERLY]: "ربع سنوي",
  [SubscriptionDuration.ANNUAL]: "سنوي",
};

const CreateSubscriptionModal = ({
  isOpen,
  onClose,
}: CreateSubscriptionModalProps) => {
  const [formData, setFormData] = React.useState({
    level: SubscriptionLevel.BASIC,
    duration: SubscriptionDuration.MONTHLY,
    cost: 0,
  });
  const { setSnackbarConfig } = useMokkBar();

  const queryClient = useQueryClient();
  const createSubscriptionMutation = useCreateSubscription({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: SUCCESS_MESSAGES.CREATE_SUBSCRIPTION,
      });
      onClose();
      setFormData({
        level: SubscriptionLevel.BASIC,
        duration: SubscriptionDuration.MONTHLY,
        cost: 0,
      });
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || ERROR_MESSAGES.CREATE_SUBSCRIPTION,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.cost <= 0) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: ERROR_MESSAGES.VALIDATION.INVALID_COST,
      });
      return;
    }

    try {
      await createSubscriptionMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const handleCancel = () => {
    if (createSubscriptionMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "جاري تنفيذ العملية، يرجى الانتظار",
      });
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={handleCancel}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-right">
          إضافة خطة اشتراك جديدة
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              مستوى الاشتراك
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as SubscriptionLevel,
                })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
            >
              {Object.entries(levelTranslations).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              مدة الاشتراك
            </label>
            <select
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: e.target.value as SubscriptionDuration,
                })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
            >
              {Object.entries(durationTranslations).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              التكلفة
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-gray-200 p-3 text-right"
                placeholder="أدخل التكلفة"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ليرة
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              إضافة الخطة
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateSubscriptionModal;
