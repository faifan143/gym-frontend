"use client";
import { useAllPlans, useMyPlans, useEnrollPlan } from "@/hooks/useCustomer";
import { formatDate } from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { User, Scroll, X, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

const PlanCard = ({ plan, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          {plan.title}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <User size={20} className="ml-2 text-blue-500" />
            <span className="text-sm">
              أخصائي التغذية: {plan.nutritionist?.user?.name || "غير محدد"}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={18} className="ml-2" />
            <span>تاريخ الإنشاء: {formatDate(plan.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(plan)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>عرض التفاصيل والتسجيل</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const PlanDetailsModal = ({
  selectedPlan,
  onClose,
  onEnroll,
  isEnrolling,
  showDetails = false,
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
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden overflow-y-auto no-scrollbar max-h-[90%]"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-600">
            {selectedPlan.title}
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="p-6 ">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="text-blue-500" size={20} />
                  معلومات أخصائي التغذية
                </h3>
                <div className="text-gray-600">
                  <p className="font-medium">
                    {selectedPlan.nutritionist?.user?.name || "غير محدد"}
                  </p>
                </div>
              </div>

              {selectedPlan.planDetails && showDetails && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Scroll className="text-blue-500" size={20} />
                    تفاصيل الخطة
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {selectedPlan.planDetails}
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar size={16} />
              آخر تحديث: {formatDate(selectedPlan.updatedAt)}
            </div>
          </div>
        </div>

        {!showDetails && isSubscribed && (
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
              onClick={() => onEnroll(selectedPlan.id)}
              disabled={isEnrolling}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
            >
              {isEnrolling ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  جاري التسجيل...
                </>
              ) : (
                "تسجيل في الخطة"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
interface CustomersPlansTabProps {
  isSubscribed: any;
  searchQuery: string;
}

const CustomersPlansTab = ({
  isSubscribed,
  searchQuery,
}: CustomersPlansTabProps) => {
  const { setSnackbarConfig } = useMokkBar();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: plansData, isLoading, isError } = useAllPlans();

  const { data: myPlans } = useMyPlans();
  const myPlansIds = myPlans ? myPlans.map((pln) => pln.id) : [];

  const filteredPlans = plansData
    ? plansData.filter((planItem) => !myPlansIds.includes(planItem.id))
    : [];

  const allFilteredPlans = filteredPlans?.filter((plan) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      plan.title.toLowerCase().includes(searchLower) ||
      plan.description?.toLowerCase().includes(searchLower) ||
      plan.nutritionist?.user.name.toLowerCase().includes(searchLower)
    );
  });
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
  const handleEnroll = (planId: string) => {
    enrollPlan({ planId });
    queryClient.invalidateQueries({
      queryKey: ["customer", "all-plans"],
    });
    queryClient.invalidateQueries({
      queryKey: ["customer", "my-plans"],
    });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-6 rounded-xl text-center"
        >
          فشل في تحميل الخطط. يرجى المحاولة مرة أخرى لاحقاً.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {allFilteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <PlanDetailsModal
            selectedPlan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onEnroll={handleEnroll}
            isEnrolling={isEnrolling}
            isSubscribed={isSubscribed}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersPlansTab;
