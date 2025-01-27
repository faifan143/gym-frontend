"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useManagerNutritionists,
  useDeleteNutritionist,
  useUpdateNutritionist,
  useManagerSpecialties,
} from "@/hooks/useManager";
import { Edit2, Trash2, X, Save, Users, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useMokkBar } from "../providers/Mokkbar";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/utils/constants";

interface NutritionistsTabProps {
  searchQuery: string;
}

const NutritionistsTab = ({ searchQuery }: NutritionistsTabProps) => {
  const queryClient = useQueryClient();
  const { setSnackbarConfig } = useMokkBar();

  const { data: nutritionistsData } = useManagerNutritionists();
  const { data: specialtiesData } = useManagerSpecialties();

  const nutritionists = nutritionistsData && nutritionistsData;
  const specialties = specialtiesData && specialtiesData;

  const deleteNutritionistMutation = useDeleteNutritionist({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manager", "nutritionists"],
      });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: SUCCESS_MESSAGES.DELETE_NUTRITIONIST,
      });
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || ERROR_MESSAGES.DELETE_NUTRITIONIST,
      });
    },
  });

  const updateNutritionistMutation = useUpdateNutritionist({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manager", "nutritionists"],
      });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: SUCCESS_MESSAGES.UPDATE_NUTRITIONIST,
      });
      setEditingId(null);
    },
    onError: (error: any) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || ERROR_MESSAGES.UPDATE_NUTRITIONIST,
      });
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", specialty: 0 });

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الأخصائي؟")) {
      try {
        await deleteNutritionistMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting nutritionist:", error);
      }
    }
  };

  const startEdit = (nutritionist: any) => {
    setEditingId(nutritionist.id);
    setEditForm({
      name: nutritionist.user.name,
      specialty: nutritionist.specialtyId,
    });
  };

  const handleUpdate = async (id: string) => {
    // Validation
    if (!editForm.name.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: ERROR_MESSAGES.VALIDATION.REQUIRED_NAME,
      });
      return;
    }

    if (!editForm.specialty) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: ERROR_MESSAGES.VALIDATION.REQUIRED_SPECIALTY,
      });
      return;
    }

    try {
      await updateNutritionistMutation.mutateAsync({
        nutritionistId: id,
        data: editForm,
      });
    } catch (error) {
      console.error("Error updating nutritionist:", error);
    }
  };

  const handleCancelEdit = () => {
    if (updateNutritionistMutation.isPending) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "جاري تنفيذ العملية، يرجى الانتظار",
      });
      return;
    }
    setEditingId(null);
  };

  const nutritionistSpecialties =
    specialties && specialties.filter((spec) => spec.target === "NUTRITIONIST");

  const filteredNutritionists = nutritionists?.filter((nutritionist) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const specialty = specialties
      ?.find((spec) => spec.id === nutritionist.specialtyId)
      ?.name.toLowerCase();

    return (
      nutritionist.user.name.toLowerCase().includes(query) ||
      specialty?.includes(query)
    );
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredNutritionists &&
        filteredNutritionists.map((nutritionist) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            key={nutritionist.id}
            className="bg-white rounded-xl shadow-sm p-6 relative border border-gray-100 hover:shadow-md"
          >
            {editingId === nutritionist.id ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => handleUpdate(nutritionist.id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
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
                          specialty: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 p-3 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {nutritionistSpecialties.map((spec) => (
                        <option value={spec.id} key={spec.id}>
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
                    onClick={() => startEdit(nutritionist)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(nutritionist.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-right">
                      {nutritionist.user.name}
                    </h3>
                    <p className="text-gray-500 text-right">
                      {nutritionist.user.email}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {(specialties &&
                          specialties.find(
                            (spec) => spec.id === nutritionist.specialtyId
                          )?.name) ||
                          ""}
                      </span>
                      <Utensils size={16} className="text-green-500" />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{nutritionist.plans?.length || 0} الخطط</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
    </div>
  );
};

export default NutritionistsTab;
