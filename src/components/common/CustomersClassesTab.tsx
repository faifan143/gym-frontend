import {
  useAllClasses,
  useAttendClass,
  useMyClasses,
} from "@/hooks/useCustomer";
import { formatDate } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Users, X } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

const ClassCard = ({ classItem, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          {classItem.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Users size={20} className="ml-2 text-blue-500" />
            <span>السعة: {classItem.maxCapacity} متدرب</span>
          </div>

          <div className="flex items-start text-gray-600">
            <Calendar size={20} className="ml-2 mt-1 text-blue-500" />
            <div className="flex flex-wrap gap-2">
              {classItem.schedule.map((slot, idx) => (
                <span
                  key={idx}
                  className="text-sm bg-blue-50 px-3 py-1 rounded-lg"
                >
                  {slot.day} - {slot.time}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <span className="text-sm text-gray-500">
            تاريخ الإنشاء: {formatDate(classItem.createdAt)}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(classItem)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          عرض التفاصيل والتسجيل
        </motion.button>
      </div>
    </motion.div>
  );
};

const ClassDetailsModal = ({
  selectedClass,
  onClose,
  onEnroll,
  isEnrolling,
  isSubscribed,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-600">
            {selectedClass.name}
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="text-blue-500" size={20} />
                المواعيد
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedClass.schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                  >
                    <span className="font-medium">{slot.day}</span>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="text-blue-500" size={20} />
                تفاصيل الكورس
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-gray-600">السعة القصوى</span>
                  <span className="font-medium">
                    {selectedClass.maxCapacity} متدرب
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-gray-600">رقم المدرب</span>
                  <span className="font-medium">
                    {selectedClass.trainer.user.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              آخر تحديث: {formatDate(selectedClass.updatedAt)}
            </div>
          </div>
        </div>

        {isSubscribed && (
          <div className="p-6 border-t flex flex-col sm:flex-row gap-3 justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              إلغاء
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEnroll(selectedClass.id)}
              disabled={isEnrolling}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:bg-blue-300"
            >
              {isEnrolling ? "جاري التسجيل..." : "تسجيل في الكورس"}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const CustomersClassesTab = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const { setSnackbarConfig } = useMokkBar();
  const [selectedClass, setSelectedClass] = useState(null);
  const { data: classesData, isLoading, isError } = useAllClasses();
  const { data: myClasses } = useMyClasses();
  const myClassesIds = myClasses ? myClasses.map((cls) => cls.id) : [];

  const filteredClasses = classesData
    ? classesData.filter((classItem) => !myClassesIds.includes(classItem.id))
    : [];

  const queryClient = useQueryClient();

  const { mutate: attendClass, isPending: isEnrolling } = useAttendClass({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "my-classes"] });
      setSelectedClass(null);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم التسجيل في الكورس بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء التسجيل في الكورس",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
        فشل في تحميل الحصص. يرجى المحاولة مرة أخرى لاحقاً.
      </div>
    );
  }

  const handleEnroll = (classId: string) => {
    attendClass(
      { classId },
      {
        onSuccess: () => {
          setSelectedClass(null);
        },
      }
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onSelect={setSelectedClass}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedClass && (
          <ClassDetailsModal
            selectedClass={selectedClass}
            onClose={() => setSelectedClass(null)}
            onEnroll={handleEnroll}
            isEnrolling={isEnrolling}
            isSubscribed={isSubscribed}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersClassesTab;
