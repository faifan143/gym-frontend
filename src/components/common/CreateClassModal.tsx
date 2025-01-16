// components/trainer/CreateClassModal.tsx
import { RootState } from "@/cache/store";
import { motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const CreateClassModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateClassModalProps) => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 20,
    teacher: userId,
    schedule: [{ day: "Monday", time: "10:00" }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "يجب أن يكون الوصف أقل من 255 حرف";
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = "يجب تحديد السعة";
    }

    if (formData.schedule.length === 0) {
      newErrors.schedule = "يجب إضافة موعد واحد على الأقل";
    }

    formData.schedule.forEach((sch, index) => {
      if (!weekDays.includes(sch.day)) {
        newErrors[`schedule.${index}.day`] = "يوم غير صحيح";
      }
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(sch.time)) {
        newErrors[`schedule.${index}.time`] = "توقيت غير صحيح";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreate(formData);
      setFormData({
        name: "",
        description: "",
        capacity: 20,
        teacher: userId,
        schedule: [{ day: "Monday", time: "10:00" }],
      });
      onClose();
    }
  };

  const addScheduleItem = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: "Monday", time: "10:00" }],
    });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: newSchedule });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl w-full max-w-lg p-6 h-[90%] overflow-y-auto no-scrollbar overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">إضافة كورس جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              اسم الكورس*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              placeholder="أدخل اسم الكورس"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              rows={3}
              placeholder="أدخل وصف الكورس"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              السعة*
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-200 p-3 text-right"
              min={1}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.capacity}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={addScheduleItem}
                className="flex items-center gap-1 text-blue-500 text-sm"
              >
                <Plus size={16} />
                <span>إضافة موعد</span>
              </button>
              <label className="text-sm font-medium text-gray-700">
                المواعيد*
              </label>
            </div>

            <div className="space-y-3">
              {formData.schedule.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => removeScheduleItem(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                  <select
                    value={item.day}
                    onChange={(e) => {
                      const newSchedule = [...formData.schedule];
                      newSchedule[index].day = e.target.value;
                      setFormData({ ...formData, schedule: newSchedule });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 p-3 text-right"
                  >
                    {weekDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => {
                      const newSchedule = [...formData.schedule];
                      newSchedule[index].time = e.target.value;
                      setFormData({ ...formData, schedule: newSchedule });
                    }}
                    className="rounded-lg border border-gray-200 p-3"
                  />
                </div>
              ))}
            </div>
            {errors.schedule && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.schedule}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              إضافة الكورس
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateClassModal;
