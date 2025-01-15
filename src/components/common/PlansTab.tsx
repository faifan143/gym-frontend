// components/nutritionist/PlansTab.tsx
import {
  useCreateNutritionPlan,
  useDeleteNutritionPlan,
  useNutritionistPlans,
  useRemoveCustomerFromPlan,
  useUpdateNutritionPlan,
} from "@/hooks/useNutrition";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Edit2, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import PlanModal from "./CreatePlanModal";
import { useMokkBar } from "../providers/Mokkbar";

interface PlanCardProps {
  plan: any;
  onEdit: (plan: any) => void;
  onDelete: (id: string) => void;
  onShowDetails: (plan: any) => void;
  isLoading: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onShowDetails,
  isLoading,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6 relative"
  >
    <div className="absolute top-4 left-4 flex gap-2">
      <button
        onClick={() => onEdit(plan)}
        disabled={isLoading}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={() => onDelete(plan.id)}
        disabled={isLoading}
        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-right">{plan.title}</h3>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <Calendar size={16} />
        <span>{new Date(plan.createdAt).toLocaleDateString("ar")}</span>
      </div>
      <button
        onClick={() => onShowDetails(plan)}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        <Users size={16} />
        <span>عرض التفاصيل</span>
      </button>
    </div>
  </motion.div>
);

interface PlanDetailsModalProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
  onRemoveCustomer: (planId: string, customerId: string) => void;
  isLoading?: boolean;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  plan,
  isOpen,
  onClose,
  onRemoveCustomer,
  isLoading,
}) => {
  const { setSnackbarConfig } = useMokkBar();

  const handleRemoveClick = (planId: string, customerId: string) => {
    if (!planId || !customerId) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "بيانات العميل غير صحيحة",
      });
      return;
    }
    onRemoveCustomer(planId, customerId);
  };

  if (!isOpen || !plan) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative h-[80%] overflow-hidden overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4">تفاصيل الخطة: {plan.title}</h3>
        <p className="mb-4 whitespace-pre-line">{plan.planDetails}</p>
        <h4 className="font-semibold mb-2">العملاء المسجلين:</h4>
        {plan.enrolledCustomers.length > 0 ? (
          <ul className="space-y-2">
            {plan.enrolledCustomers.map((enrollment) => (
              <li
                key={enrollment.customerId}
                className="flex justify-between items-center p-2 border rounded-lg"
              >
                <span>{enrollment.customer.user.name}</span>
                <button
                  onClick={() =>
                    handleRemoveClick(plan.id, enrollment.customerId)
                  }
                  disabled={isLoading}
                  className="text-red-500 hover:underline disabled:text-red-300 disabled:no-underline"
                >
                  إزالة
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            لا يوجد عملاء مسجلين في هذه الخطة.
          </p>
        )}
      </div>
    </div>
  );
};

const PlansTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: plans } = useNutritionistPlans();

  const createPlanMutation = useCreateNutritionPlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionist", "plans"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إنشاء الخطة بنجاح",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء إنشاء الخطة",
      });
    },
  });

  const updatePlanMutation = useUpdateNutritionPlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionist", "plans"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحديث الخطة بنجاح",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء تحديث الخطة",
      });
    },
  });

  const deletePlanMutation = useDeleteNutritionPlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionist", "plans"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم حذف الخطة بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء حذف الخطة",
      });
    },
  });

  const removeCustomerMutation = useRemoveCustomerFromPlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutritionist", "plans"] });
      queryClient.invalidateQueries({
        queryKey: ["nutritionist", "plan", selectedPlan?.id, "customers"],
      });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إزالة العميل من الخطة بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء إزالة العميل",
      });
    },
  });

  const handleCreateClick = () => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    setModalMode("create");
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (plan: any) => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    setModalMode("edit");
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (!data.title?.trim() || !data.planDetails?.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "جميع الحقول مطلوبة",
      });
      return;
    }

    try {
      if (modalMode === "create") {
        await createPlanMutation.mutateAsync(data);
      } else if (modalMode === "edit" && selectedPlan) {
        await updatePlanMutation.mutateAsync({
          planId: selectedPlan.id,
          data,
        });
      }
    } catch (error) {
      console.error("Error handling modal submit:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }

    if (window.confirm("هل أنت متأكد من حذف هذه الخطة؟")) {
      try {
        await deletePlanMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const handleRemoveCustomer = async (planId: string, customerId: string) => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }

    if (window.confirm("هل أنت متأكد من إزالة هذا العميل؟")) {
      try {
        await removeCustomerMutation.mutateAsync({ planId, customerId });
      } catch (error) {
        console.error("Error removing customer:", error);
      }
    }
  };

  const isLoading =
    createPlanMutation.isPending ||
    updatePlanMutation.isPending ||
    deletePlanMutation.isPending ||
    removeCustomerMutation.isPending;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleCreateClick}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة خطة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onShowDetails={(plan) => {
              if (!isLoading) {
                setSelectedPlan(plan);
                setIsDetailsModalOpen(true);
              }
            }}
            isLoading={isLoading}
          />
        ))}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={{
          title: selectedPlan?.title || "",
          planDetails: selectedPlan?.planDetails || "",
        }}
        mode={modalMode}
        isLoading={isLoading}
      />

      <PlanDetailsModal
        plan={selectedPlan}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onRemoveCustomer={handleRemoveCustomer}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PlansTab;