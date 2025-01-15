import { useCreateTrainer, useManagerSpecialties } from "@/hooks/useManager";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { useMokkBar } from "../providers/Mokkbar";

interface CreateTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTrainerModal = ({ isOpen, onClose }: CreateTrainerModalProps) => {
  const { setSnackbarConfig } = useMokkBar();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    specialty: 0,
  });
  const queryClient = useQueryClient();
  const { data: specialties } = useManagerSpecialties();
  const createTrainerMutation = useCreateTrainer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: SUCCESS_MESSAGES.CREATE_TRAINER,
      });
      onClose();
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || ERROR_MESSAGES.CREATE_TRAINER,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.specialty
    ) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS,
      });
      return;
    }

    try {
      await createTrainerMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error creating trainer:", error);
    }
  };

  const handleCancel = () => {
    if (createTrainerMutation.isPending) {
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

        <h2 className="text-2xl font-bold mb-6 text-right">إضافة مدرب جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              الاسم
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              placeholder="ادخل اسم المدرب"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              placeholder="ادخل البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              placeholder="ادخل كلمة المرور"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              التخصص
            </label>
            <select
              value={formData.specialty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialty: parseInt(e.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
            >
              <option value="">اختر اختصاص</option>
              {specialties &&
                specialties
                  .filter((spec) => spec.target == "TRAINER")
                  .map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              إضافة المدرب
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateTrainerModal;
