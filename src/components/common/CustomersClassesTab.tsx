import {
  useAllClasses,
  useAttendClass,
  useMyClasses,
} from "@/hooks/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, Users } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";
import { formatDate } from "@/utils/constants";
const CustomersClassesTab = () => {
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

  const formatClassSchedule = (schedule: any[]) => {
    return schedule.map((slot) => `${slot.day} - ${slot.time}`).join(" • ");
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {classItem.name}
              </h3>

              <div className="flex items-center mb-3 text-gray-600">
                <Users size={20} className="ml-2" />
                <span>السعة: {classItem.maxCapacity} متدرب</span>
              </div>

              <div className="flex items-start mb-4 text-gray-600">
                <Calendar size={20} className="ml-2 mt-1" />
                <span>{formatClassSchedule(classItem.schedule)}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <span className="text-sm text-gray-500">
                  تاريخ الإنشاء: {formatDate(classItem.createdAt)}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedClass(classItem)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                عرض التفاصيل والتسجيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                {selectedClass.name}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">المواعيد</h3>
                  <div className="space-y-2">
                    {selectedClass.schedule.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg"
                      >
                        <Calendar size={18} className="ml-2" />
                        <span className="ml-4">{slot.day}</span>
                        <Clock size={18} className="ml-2 mr-4" />
                        <span>{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">تفاصيل الكورس</h3>
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="ml-2" />
                    <span>السعة القصوى: {selectedClass.maxCapacity} متدرب</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="ml-2" />
                    <span>رقم المدرب: {selectedClass.trainerId}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  آخر تحديث: {formatDate(selectedClass.updatedAt)}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleEnroll(selectedClass.id)}
                  disabled={isEnrolling}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-300"
                >
                  {isEnrolling ? "جاري التسجيل..." : "تسجيل في الكورس"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersClassesTab;
