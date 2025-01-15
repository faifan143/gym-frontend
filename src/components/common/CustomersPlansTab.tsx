import { useAllPlans, useEnrollPlan, useMyPlans } from "@/hooks/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";
import { formatDate } from "@/utils/constants";

const CustomersPlansTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: plansData, isLoading, isError } = useAllPlans();

  const { data: myPlans } = useMyPlans();
  const myPlansIds = myPlans ? myPlans.map((pln) => pln.id) : [];

  const filteredPlans = plansData
    ? plansData.filter((planItem) => !myPlansIds.includes(planItem.id))
    : [];
  const { mutate: enrollPlan, isPending: isEnrolling } = useEnrollPlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "all-plans"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "my-plans"] });
      setSelectedPlan(null);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم التسجيل في الخطة بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء التسجيل في الخطة",
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
        فشل في تحميل الخطط. يرجى المحاولة مرة أخرى لاحقاً.
      </div>
    );
  }

  const handleEnroll = (planId: string) => {
    enrollPlan({ planId });
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {plan.title}
              </h3>

              <div className="flex items-center mb-3 text-gray-600">
                <User size={20} className="ml-2" />
                <span>
                  أخصائي التغذية: {plan.nutritionist?.user?.name || "غير محدد"}
                </span>
              </div>

              {/* <div className="flex items-start mb-4 text-gray-600">
                <Scroll size={20} className="ml-2 mt-1 flex-shrink-0" />
                <p className="text-sm line-clamp-3">{plan.planDetails}</p>
              </div> */}

              <div className="border-t pt-4 mt-4">
                <span className="text-sm text-gray-500">
                  تاريخ الإنشاء: {formatDate(plan.createdAt)}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                عرض التفاصيل والتسجيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                {selectedPlan.title}
              </h2>

              <div className="space-y-6">
                {/* <div>
                  <h3 className="text-lg font-semibold mb-3">تفاصيل الخطة</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                    {selectedPlan.planDetails}
                  </div>
                </div> */}

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">معلومات إضافية</h3>
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="ml-2" />
                    <span>
                      أخصائي التغذية:{" "}
                      {selectedPlan.nutritionist?.user?.name || "غير محدد"}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  آخر تحديث: {formatDate(selectedPlan.updatedAt)}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleEnroll(selectedPlan.id)}
                  disabled={isEnrolling}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-300"
                >
                  {isEnrolling ? "جاري التسجيل..." : "تسجيل في الخطة"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPlansTab;
