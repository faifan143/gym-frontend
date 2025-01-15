import { CreateNutritionPlanDto, UpdateNutritionPlanDto } from "@/types/types";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// Fetch all nutrition plans for the logged-in nutritionist
export const useNutritionistPlans = () => {
  return useQuery({
    queryKey: ["nutritionist", "plans"],
    queryFn: async () => {
      const response = await apiClient.get("/nutritionist/plans");
      return response;
    },
  });
};

// Fetch a specific nutrition plan by ID
export const useNutritionPlan = (planId: string) => {
  return useQuery({
    queryKey: ["nutritionist", "plan", planId],
    queryFn: async () => {
      const response = await apiClient.get(`/nutritionist/plan/${planId}`);
      return response;
    },
    enabled: !!planId, // Only run query if planId is provided
  });
};

// Fetch customers enrolled in a specific nutrition plan
export const usePlanCustomers = (planId: string) => {
  return useQuery({
    queryKey: ["nutritionist", "plan", planId, "customers"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/nutritionist/plan/${planId}/customers`
      );
      return response;
    },
    enabled: !!planId, // Only run query if planId is provided
  });
};

// Create a new nutrition plan
export const useCreateNutritionPlan = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: CreateNutritionPlanDto) => {
      const response = await apiClient.post("/nutritionist/create-plan", data);
      return response;
    },
    onSuccess,
    onError,
  });
};

// Update an existing nutrition plan
export const useUpdateNutritionPlan = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      planId,
      data,
    }: {
      planId: string;
      data: UpdateNutritionPlanDto;
    }) => {
      const response = await apiClient.put(
        `/nutritionist/plan/${planId}`,
        data
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

// Delete a specific nutrition plan
export const useDeleteNutritionPlan = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiClient.delete(`/nutritionist/plan/${planId}`);
      return response;
    },
    onSuccess,
    onError,
  });
};

// Remove a customer from a specific nutrition plan
export const useRemoveCustomerFromPlan = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      planId,
      customerId,
    }: {
      planId: string;
      customerId: string;
    }) => {
      const response = await apiClient.delete(
        `/nutritionist/plan/${planId}/customer/${customerId}`
      );
      return response;
    },
    onSuccess,
    onError,
  });
};
