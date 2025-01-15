import {
  UpdateSubscriptionPlanDto,
  useDeleteSubscription,
  useManagerSubscriptions,
  useUpdateSubscription,
} from "@/hooks/useManager";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

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

const SubscriptionsTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const queryClient = useQueryClient();
  const { data: subscriptions } = useManagerSubscriptions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    level: "",
    duration: "",
    cost: 0,
  });

  const updateMutation = useUpdateSubscription({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحديث الاشتراك بنجاح",
      });
      setEditingId(null);
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء تحديث الاشتراك",
      });
    },
  });

  const deleteMutation = useDeleteSubscription({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "subscriptions"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم حذف الاشتراك بنجاح",
      });
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء حذف الاشتراك",
      });
    },
  });

  const handleDelete = async (id: string) => {
    if (editingId) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى إنهاء عملية التحديث أولاً",
      });
      return;
    }

    if (window.confirm("هل أنت متأكد من حذف هذا الاشتراك؟")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const startEdit = (subscription: any) => {
    if (deleteMutation.isPending || updateMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    setEditingId(subscription.id);
    setEditForm({
      level: subscription.level,
      duration: subscription.duration,
      cost: subscription.cost,
    });
  };

  const handleUpdate = async (id: string) => {
    if (editForm.cost <= 0) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب أن تكون التكلفة أكبر من صفر",
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        subscriptionId: id,
        data: editForm as UpdateSubscriptionPlanDto,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleCancelEdit = () => {
    if (updateMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "جاري تنفيذ التحديث، يرجى الانتظار",
      });
      return;
    }
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {subscriptions &&
        subscriptions.map((subscription) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6 relative border border-gray-100 hover:shadow-md"
          >
            {editingId === subscription.id ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => handleUpdate(subscription.id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                    disabled={updateMutation.isPending}
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
                    disabled={updateMutation.isPending}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="pt-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      المستوى
                    </label>
                    <select
                      value={editForm.level}
                      onChange={(e) =>
                        setEditForm({ ...editForm, level: e.target.value })
                      }
                      className="w-full rounded-lg border p-3 text-right"
                      disabled={updateMutation.isPending}
                    >
                      {Object.entries(levelTranslations).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      المدة
                    </label>
                    <select
                      value={editForm.duration}
                      onChange={(e) =>
                        setEditForm({ ...editForm, duration: e.target.value })
                      }
                      className="w-full rounded-lg border p-3 text-right"
                      disabled={updateMutation.isPending}
                    >
                      {Object.entries(durationTranslations).map(
                        ([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      التكلفة
                    </label>
                    <input
                      type="number"
                      value={editForm.cost}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          cost: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border p-3 text-right"
                      disabled={updateMutation.isPending}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => startEdit(subscription)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={deleteMutation.isPending}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {levelTranslations[subscription.level]}
                    </span>
                    <h3 className="text-xl font-bold">
                      {durationTranslations[subscription.duration]}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {subscription.cost} ليرة
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
    </div>
  );
};

export default SubscriptionsTab;
