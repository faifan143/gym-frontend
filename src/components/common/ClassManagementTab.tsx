// components/trainer/ClassesTab.tsx
import {
  useCreateClass,
  useDeleteClass,
  useTrainerClasses,
  useUpdateClass,
  useClassCustomers,
  useClassScheduleAttendance,
  useMarkAttendance,
  useRemoveCustomerFromClass,
} from "@/hooks/useTrainer";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Users, Calendar, X, Save } from "lucide-react";
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
      queryClient.invalidateQueries({
        queryKey: [
          "trainer",
          "class",
          classId,
          "attendance",
          `${scheduleSlot.day}_${scheduleSlot.time}`,
        ],
      });
      queryClient.refetchQueries({
        queryKey: ["trainer", "class", classId, "attendance"],
      });
      queryClient.refetchQueries({
        queryKey: [
          "trainer",
          "class",
          classId,
          "attendance",
          `${scheduleSlot.day}_${scheduleSlot.time}`,
        ],
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg w-full max-w-md h-[90%] overflow-hidden overflow-y-auto no-scrollbar">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold">
              سجل الحضور - {scheduleSlot.day} {scheduleSlot.time}
            </h3>
          </div>

          <div className="space-y-4">
            {customers &&
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <button
                    onClick={() => handleMarkAttendance(customer.id)}
                    className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                      isAttended(customer.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={isAttended(customer.id)}
                  >
                    {isAttended(customer.id) ? "تم التسجيل" : "تسجيل حضور"}
                  </button>
                  <span className="font-medium">{customer.user.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
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
      queryClient.refetchQueries({
        queryKey: ["trainer", "class", cls.id, "customers"],
      });
    },
  });

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6 relative"
      >
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => {
              onUpdate(cls.id, editForm);
              setIsEditing(false);
            }}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Save size={18} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 pt-8">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full rounded-lg border p-2 text-right"
          />

          <input
            type="number"
            value={editForm.maxCapacity}
            onChange={(e) =>
              setEditForm({ ...editForm, maxCapacity: Number(e.target.value) })
            }
            className="w-full rounded-lg border p-2 text-right"
            min={1}
          />

          {editForm.schedule.map((sch, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={sch.day}
                onChange={(e) => {
                  const newSchedule = [...editForm.schedule];
                  newSchedule[idx].day = e.target.value;
                  setEditForm({ ...editForm, schedule: newSchedule });
                }}
                className="flex-1 rounded-lg border p-2"
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
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
                className="rounded-lg border p-2"
              />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 relative"
    >
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(cls.id)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-right">{cls.name}</h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{cls.maxCapacity} طالب</span>
          <Calendar size={16} />
        </div>

        <div className="space-y-2">
          {cls.schedule.map((sch, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSchedule(sch)}
              className="w-full text-sm text-right text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center"
            >
              <Users size={16} className="text-blue-500" />
              <span>
                {sch.day} - {sch.time}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCustomers(!showCustomers)}
          className="flex items-center gap-2 w-full justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Users size={16} />
          <span>عرض الزبائن ({cls.customers?.length || 0})</span>
        </button>

        {showCustomers && customers?.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {customers &&
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex justify-between items-center text-sm"
                >
                  <button
                    onClick={async () => {
                      await onRemoveCustomer({
                        classId: cls.id,
                        customerId: customer.id,
                      });
                      console.log("claId  ", cls.id);
                      console.log("cutomer id  :  ", customer.id);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    إزالة
                  </button>
                  <span className="text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString("ar")}
                  </span>
                  <span>{customer.user.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedSchedule && (
        <AttendanceModal
          scheduleSlot={selectedSchedule}
          classId={cls.id}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
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

  const createClass = async (data) => {
    try {
      await createClassMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          <span>إضافة كورس جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {classes &&
            classes.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
        </AnimatePresence>
      </div>

      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createClass}
      />
    </div>
  );
};

export default ClassesTab;
