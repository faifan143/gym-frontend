import { formatDate } from "@/utils/constants";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    CreditCard,
    Dumbbell,
    PlusCircle,
    User,
    Users,
    Utensils,
} from "lucide-react";

const Overview = ({
  expiredSubscriptions,
  handleDetachExpired,
  isDetaching,
  managerCustomers,
  managerTrainers,
  managerNeutritionists,
  managerSpecialties,
  setIsTrainerModalOpen,
  setIsNeutritionModalOpen,
  setIsSubscriptionModalOpen,
  setIsSpecialtyModalOpen,
}) => {
  return (
    <main className="p-4 md:p-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">عدد العملاء</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {managerCustomers?.length}
              </h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المدربين النشطين</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {managerTrainers?.length}
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Dumbbell className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">أخصائيي التغذية</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {managerNeutritionists?.length}
              </h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Utensils className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">عدد الاختصاصات</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {managerSpecialties?.length || 0}
              </h3>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsTrainerModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>إضافة مدرب</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNeutritionModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>إضافة أخصائي</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>إضافة اشتراك</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSpecialtyModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>إضافة تخصص</span>
        </motion.button>
      </div>

      {/* Expired Subscriptions Section */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {expiredSubscriptions?.count == 0 ? (
                <div className="text-center text-gray-500">
                  لايوجد اشتراكات منتهية
                </div>
              ) : (
                <div className="flex flex-col">
                  {expiredSubscriptions?.count > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            الاشتراكات المنتهية
                          </h3>
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                            {expiredSubscriptions?.count} منتهي
                          </span>
                        </div>

                        <div className="space-y-3">
                          {expiredSubscriptions?.details.map((subscription) => (
                            <motion.div
                              key={`${subscription.subscriptionId}-${subscription.customerId}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-700">
                                      {subscription.customerName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {subscription.subscriptionLevel}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                      انتهى في:{" "}
                                      {formatDate(subscription.endDate)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end gap-1">
                                  <span className="text-sm text-gray-500">
                                    {subscription.customerEmail}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ID: {subscription.customerId}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDetachExpired}
                    disabled={isDetaching}
                    className="bg-orange-400 hover:bg-orange-500 mt-4 py-3 px-4 rounded-md text-white transition-colors mx-auto w-full sm:w-2/3 md:w-1/3 disabled:bg-orange-300"
                  >
                    {isDetaching
                      ? "جاري إلغاء الاشتراكات..."
                      : "الغاء اشتراك جميع المستنفذين"}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Overview;
