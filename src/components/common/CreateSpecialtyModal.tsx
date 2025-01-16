import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCreateSpecialty } from "@/hooks/useManager";
import { useQueryClient } from "@tanstack/react-query";
import { useMokkBar } from "../providers/Mokkbar";

interface CreateSpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSpecialtyModal = ({
  isOpen,
  onClose,
}: CreateSpecialtyModalProps) => {
  const { setSnackbarConfig } = useMokkBar();

  const [formData, setFormData] = React.useState({
    name: "",
    target: "TRAINER" as "TRAINER" | "NUTRITIONIST",
  });

  const queryClient = useQueryClient();

  const createSpecialtyMutation = useCreateSpecialty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "specialties"] });

      queryClient.invalidateQueries({
        queryKey: ["manager", "trainers-specialties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["manager", "nutritionists-specialties"],
      });
      queryClient.refetchQueries({ queryKey: ["manager", "specialties"] });

      queryClient.refetchQueries({
        queryKey: ["manager", "trainers-specialties"],
      });
      queryClient.refetchQueries({
        queryKey: ["manager", "nutritionists-specialties"],
      });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إضافة التخصص بنجاح",
      });
      onClose();
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء إضافة التخصص",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال اسم التخصص",
      });
      return;
    }
    try {
      await createSpecialtyMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by onError in the mutation
      console.error("Error creating specialty:", error);
    }
  };

  const handleCancel = () => {
    if (createSpecialtyMutation.isPending) {
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

        <h2 className="text-2xl font-bold mb-6 text-right">إضافة تخصص جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              اسم التخصص
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              placeholder="ادخل اسم التخصص"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              نوع التخصص
            </label>
            <select
              value={formData.target}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  target: e.target.value as "TRAINER" | "NUTRITIONIST",
                })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
            >
              <option value="TRAINER">مدرب</option>
              <option value="NUTRITIONIST">أخصائي تغذية</option>
            </select>
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
              disabled={createSpecialtyMutation.isPending}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300`}
            >
              {createSpecialtyMutation.isPending
                ? "جاري الإضافة..."
                : "إضافة التخصص"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateSpecialtyModal;
