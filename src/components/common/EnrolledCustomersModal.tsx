"use client";
import { useRemoveCustomerFromClass } from "@/hooks/useTrainer";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileSpreadsheet, UserMinus, Users, X } from "lucide-react";
import * as XLSX from "xlsx";

export const EnrolledCustomersModal = ({ customers, onClose, cls }) => {
  const queryClient = useQueryClient();
  console.log("customer : ", customers);

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

  const handleExportExcel = () => {
    const exportData = customers.map((customer) => ({
      الاسم: customer.user.name,
      "البريد الالكتروني": customer.user.email || "غير متوفر",
      "تاريخ الانضمام": new Date(customer.createdAt).toLocaleDateString("ar"),
      "عدد الحضور": `${customer.attendedClasses.length} حصة`,
      "تاريخ انتهاء الاشتراك": customer.subscriptions[0]
        ? new Date(customer.subscriptions[0].endDate).toLocaleDateString("ar")
        : "غير متوفر",
      الحالة:
        customer.subscriptions[0]?.endDate > new Date().toISOString()
          ? "نشط"
          : "منتهي",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!dir"] = "rtl";

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, `${cls.name}-customers.xlsx`);
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
        className="bg-white rounded-2xl w-full max-w-5xl "
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            الطلاب المسجلين ({customers?.length || 0})
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Export Buttons */}
        <div className="px-6 pt-4 flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <FileSpreadsheet size={16} />
            <span>تصدير Excel</span>
          </motion.button>
        </div>
        {/* Table Content */}
        <div className="p-6 overflow-hidden overflow-y-auto no-scrollbar max-h-[60dvh]">
          {customers?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              لا يوجد طلاب مسجلين
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    الصورة
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    البريد الالكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    تاريخ الانضمام
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    عدد الحضور
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    تاريخ انتهاء الاشتراك
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    الحالة
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={customer.user.photo}
                          alt={customer.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {customer.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.user.email || "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString("ar")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium text-nowrap">
                        {customer.attendedClasses.length} حصة
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.subscriptions[0]
                        ? new Date(
                            customer.subscriptions[0].endDate
                          ).toLocaleDateString("ar")
                        : "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.subscriptions[0]?.endDate >
                          new Date().toISOString()
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.subscriptions[0]?.endDate >
                        new Date().toISOString()
                          ? "نشط"
                          : "منتهي"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
