import {
  useDeleteTrainer,
  useManagerSpecialties,
  useManagerTrainers,
  useManagerTrainersCustomers,
  useUpdateTrainer,
} from "@/hooks/useManager";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Edit2, Save, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

const TrainersTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const queryClient = useQueryClient();
  const { data: trainers } = useManagerTrainers();
  const { data: trainersCustomers } = useManagerTrainersCustomers();
  const { data: specialties } = useManagerSpecialties();

  const mergedTrainers =
    trainers &&
    trainers.map((trainer) => {
      const trainerWithCustomers = trainersCustomers?.find(
        (t) => t.id === trainer.id
      );
      return {
        ...trainer,
        classes: trainerWithCustomers?.classes || [],
      };
    });

  const deleteTrainerMutation = useDeleteTrainer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم حذف المدرب بنجاح",
      });
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء حذف المدرب",
      });
    },
  });

  const updateTrainerMutation = useUpdateTrainer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "trainers"] });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحديث بيانات المدرب بنجاح",
      });
      setEditingId(null);
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء تحديث البيانات",
      });
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", specialty: 0 });
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleDetails = (id: string) => {
    if (editingId) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى إنهاء عملية التحديث أولاً",
      });
      return;
    }
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id: string) => {
    if (editingId) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى إنهاء عملية التحديث أولاً",
      });
      return;
    }

    if (window.confirm("هل أنت متأكد من حذف هذا المدرب؟")) {
      try {
        await deleteTrainerMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting trainer:", error);
      }
    }
  };

  const startEdit = (trainer: any) => {
    if (deleteTrainerMutation.isPending || updateTrainerMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يرجى الانتظار حتى اكتمال العملية الحالية",
      });
      return;
    }
    setEditingId(trainer.id);
    setEditForm({
      name: trainer.user.name,
      specialty: trainer.specialtyId,
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال اسم المدرب",
      });
      return;
    }

    if (!editForm.specialty) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى اختيار التخصص",
      });
      return;
    }

    try {
      await updateTrainerMutation.mutateAsync({
        trainerId: id,
        data: editForm,
      });
    } catch (error) {
      console.error("Error updating trainer:", error);
    }
  };

  const handleCancelEdit = () => {
    if (updateTrainerMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "جاري تنفيذ التحديث، يرجى الانتظار",
      });
      return;
    }
    setEditingId(null);
  };

  // Return JSX with updated button handlers and disabled states
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {mergedTrainers?.map((trainer) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          key={trainer.id}
          className="bg-white rounded-xl shadow-sm p-6 relative border border-gray-100 hover:shadow-md"
        >
          {editingId === trainer.id ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => handleUpdate(trainer.id)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                  disabled={updateTrainerMutation.isPending}
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
                  disabled={updateTrainerMutation.isPending}
                >
                  <X size={18} />
                </button>
              </div>
              {/* Form fields with disabled state */}
              <div className="pt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 p-3 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={updateTrainerMutation.isPending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    التخصص
                  </label>
                  <select
                    value={editForm.specialty}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        specialty: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 p-3 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={updateTrainerMutation.isPending}
                  >
                    {specialties &&
                      specialties
                        .filter((spec) => spec.target == "TRAINER")
                        .map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => startEdit(trainer)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  disabled={deleteTrainerMutation.isPending}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(trainer.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                  disabled={deleteTrainerMutation.isPending}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-right">
                    {trainer.user.name}
                  </h3>
                  <p className="text-gray-500 text-right">
                    {trainer.user.email}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-blue-600">
                    <span className="text-sm font-medium">
                      {specialties &&
                        specialties.find(
                          (spec) => spec.id == trainer.specialtyId
                        ).name}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>{trainer.classes.length} الحصص</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        {trainer.classes.reduce(
                          (acc, cls) => acc + cls.maxCapacity,
                          0
                        )}{" "}
                        عدد الطلاب
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={showDetails[trainer.id] || false}
                      onChange={() => toggleDetails(trainer.id)}
                    />
                    <span className="text-sm font-medium">عرض الحضور</span>
                  </label>
                </div>
              </div>
            </>
          )}
          {showDetails[trainer.id] && trainer.classes.length > 0 && (
            <CustomersSection classes={trainer.classes} />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TrainersTab;

const CustomersSection = ({ classes }) => (
  <div className="space-y-2 border-t border-gray-100 pt-4">
    <h4 className="text-sm font-medium text-gray-600 text-right">
      حضور الطلاب
    </h4>
    {classes.map((cls) => {
      const totalAttendances = cls.attendances?.length || 0;

      return (
        <div key={cls.id} className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">
              {totalAttendances} / {cls.maxCapacity} حضور
            </span>
            <span className="font-medium text-sm">{cls.name}</span>
          </div>
          {totalAttendances > 0 && (
            <div className="divide-y divide-gray-100">
              {cls.attendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className="py-2 text-sm flex items-center justify-between"
                >
                  <span className="text-gray-500">
                    {new Date(attendance.date).toLocaleDateString("ar")}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {attendance.customer.user.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
