import {
  useClassCustomers,
  useClassScheduleAttendance,
  useCreateClass,
  useDeleteClass,
  useMarkAttendance,
  useRemoveCustomerFromClass,
  useTrainerClasses,
  useUpdateClass,
} from "@/hooks/useTrainer";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit2,
  Plus,
  Trash2,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import CreateClassModal from "./CreateClassModal";

const AttendanceModal = ({ scheduleSlot, classId, onClose }) => {
  const queryClient = useQueryClient();
  const { data: customers } = useClassCustomers(classId);
  const { data: attendance } = useClassScheduleAttendance({
    classId,
    scheduleId: `${scheduleSlot.day}_${scheduleSlot.time}`,
  });

  const markAttendanceMutation = useMarkAttendance({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainer", "class", classId, "attendance"],
      });
    },
  });

  const handleMarkAttendance = async (customerId) => {
    try {
      await markAttendanceMutation.mutateAsync({
        classId,
        scheduleId: `${scheduleSlot.day}_${scheduleSlot.time}`,
        customerId,
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const isAttended = (customerId) => {
    return (
      attendance?.customers &&
      attendance.customers.find((a) => a.customerId === customerId).isAttended
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            {scheduleSlot.day} - {scheduleSlot.time}
          </h3>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            {customers?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                لا يوجد طلاب مسجلين
              </div>
            ) : (
              customers?.map((customer) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={customer.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMarkAttendance(customer.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isAttended(customer.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={isAttended(customer.id)}
                  >
                    {isAttended(customer.id) ? (
                      <>
                        <CheckCircle size={16} />
                        تم التسجيل
                      </>
                    ) : (
                      "تسجيل حضور"
                    )}
                  </motion.button>
                  <span className="font-medium">{customer.user.name}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ClassCard = ({ cls, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editForm, setEditForm] = useState({
    name: cls.name,
    maxCapacity: cls.maxCapacity,
    schedule: cls.schedule,
  });

  const queryClient = useQueryClient();
  const { data: customers } = useClassCustomers(cls.id);
  const { mutateAsync: onRemoveCustomer } = useRemoveCustomerFromClass({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainer", "class", cls.id, "customers"],
      });
    },
  });

  const scheduleLabels = {
    Monday: "الإثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
    Sunday: "الأحد",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      {isEditing ? (
        // Edit Form Section
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 border-b"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الكورس
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العدد الأقصى للطلاب
              </label>
              <input
                type="number"
                value={editForm.maxCapacity}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    maxCapacity: Number(e.target.value),
                  })
                }
                min={1}
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المواعيد
              </label>
              <div className="space-y-2">
                {editForm.schedule.map((sch, idx) => (
                  <div key={idx} className="flex gap-2">
                    <select
                      value={sch.day}
                      onChange={(e) => {
                        const newSchedule = [...editForm.schedule];
                        newSchedule[idx].day = e.target.value;
                        setEditForm({ ...editForm, schedule: newSchedule });
                      }}
                      className="flex-1 rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                      dir="rtl"
                    >
                      {Object.entries(scheduleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={sch.time}
                      onChange={(e) => {
                        const newSchedule = [...editForm.schedule];
                        newSchedule[idx].time = e.target.value;
                        setEditForm({ ...editForm, schedule: newSchedule });
                      }}
                      className="w-32 rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const newSchedule = editForm.schedule.filter(
                          (_, i) => i !== idx
                        );
                        setEditForm({ ...editForm, schedule: newSchedule });
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditForm({
                      ...editForm,
                      schedule: [
                        ...editForm.schedule,
                        { day: "Monday", time: "12:00" },
                      ],
                    });
                  }}
                  className="w-full p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  <span>إضافة موعد جديد</span>
                </motion.button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onUpdate(cls.id, editForm);
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={18} />
                <span>حفظ التغييرات</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditForm({
                    name: cls.name,
                    maxCapacity: cls.maxCapacity,
                    schedule: cls.schedule,
                  });
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                <span>إلغاء</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        // View Mode Section
        <>
          {/* Card Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{cls.name}</h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(cls.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{cls.maxCapacity} طالب</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{cls.schedule.length} مواعيد</span>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-4 bg-slate-100">
            <div className="space-y-2">
              {cls.schedule.map((sch, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSchedule(sch)}
                  className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                >
                  <div className="flex items-center gap-2 text-blue-500">
                    <Users size={16} />
                    <span className="text-sm">تسجيل الحضور</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {scheduleLabels[sch.day]} - {sch.time}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Students Section */}
          <div className="p-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCustomers(!showCustomers)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  الطلاب المسجلين ({customers?.length || 0})
                </span>
                <Users size={16} className="text-blue-500" />
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform ${
                  showCustomers ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {showCustomers && customers?.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-4">
                    {customers.map((customer) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key={customer.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            {customer.user.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(customer.createdAt).toLocaleDateString(
                              "ar"
                            )}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            onRemoveCustomer({
                              classId: cls.id,
                              customerId: customer.id,
                            })
                          }
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <UserMinus size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedSchedule && (
          <AttendanceModal
            scheduleSlot={selectedSchedule}
            classId={cls.id}
            onClose={() => setSelectedSchedule(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ClassesTab = () => {
  const queryClient = useQueryClient();
  const { data: classes } = useTrainerClasses();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createClassMutation = useCreateClass({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateClassMutation = useUpdateClass({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
    },
  });

  const deleteClassMutation = useDeleteClass({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
      try {
        await deleteClassMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateClassMutation.mutateAsync({ classId: id, data });
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة كورس جديد</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {classes?.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateClassModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={async (data) => {
              try {
                await createClassMutation.mutateAsync(data);
              } catch (error) {
                console.error("Error creating class:", error);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassesTab;
