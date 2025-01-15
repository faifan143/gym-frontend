import { motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; planDetails: string }) => void;
  initialData?: { title: string; planDetails: string };
  mode: "create" | "edit";
  isLoading?: boolean;
}

const PlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = { title: "", planDetails: "" },
  mode,
  isLoading = false,
}: PlanModalProps) => {
  const { setSnackbarConfig } = useMokkBar();
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال عنوان الخطة",
      });
      return;
    }

    if (!formData.planDetails.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال تفاصيل الخطة",
      });
      return;
    }

    if (formData.planDetails.length > 1000) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "تفاصيل الخطة يجب أن لا تتجاوز 1000 حرف",
      });
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    if (isLoading) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[90%] overflow-hidden overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-right">
          {mode === "create" ? "إضافة خطة تغذية جديدة" : "تعديل الخطة"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-right mb-1">
              عنوان الخطة
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder={
                mode === "create"
                  ? "أدخل عنوان الخطة الغذائية"
                  : "تعديل عنوان الخطة الغذائية"
              }
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-right mb-1">
              تفاصيل الخطة
            </label>
            <div className="relative">
              <textarea
                name="planDetails"
                value={formData.planDetails}
                onChange={handleInputChange}
                className="w-full rounded-lg border p-3 h-32 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder={
                  mode === "create"
                    ? "أدخل تفاصيل الخطة الغذائية"
                    : "تعديل تفاصيل الخطة الغذائية"
                }
                maxLength={1000}
                required
                disabled={isLoading}
              />
              <div className="absolute bottom-2 left-2 text-sm text-gray-500">
                {formData.planDetails.length}/1000
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 disabled:text-gray-400 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "create" ? "جاري الإضافة..." : "جاري الحفظ..."}
                </>
              ) : mode === "create" ? (
                "إضافة"
              ) : (
                "حفظ التعديلات"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PlanModal;
