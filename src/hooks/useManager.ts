/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useManager.ts
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubscriptionLevel, SubscriptionDuration } from "@/types/types";

// Types based on DTOs
interface CreateTrainerDto {
  name: string;
  email: string;
  password: string;
  specialty: number;
}

interface UpdateTrainerDto {
  name?: string;
  specialty?: number;
}

interface CreateNutritionistDto {
  name: string;
  email: string;
  password: string;
  specialty: number;
}

interface UpdateNutritionistDto {
  name?: string;
  specialty?: number;
}

interface CreateSubscriptionPlanDto {
  level: SubscriptionLevel;
  duration: SubscriptionDuration;
  cost: number;
}

export interface UpdateSubscriptionPlanDto {
  level?: SubscriptionLevel;
  duration?: SubscriptionDuration;
  cost?: number;
}

// Queries
export const useManagerTrainers = () => {
  return useQuery({
    queryKey: ["manager", "trainers"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/trainers");
      return response;
    },
  });
};

export const useManagerNutritionists = () => {
  return useQuery({
    queryKey: ["manager", "nutritionists"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/nutritionists");
      return response;
    },
  });
};

export const useManagerSubscriptions = () => {
  return useQuery({
    queryKey: ["manager", "subscriptions"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/subscriptions");
      return response;
    },
  });
};

export const useManagerCustomers = () => {
  return useQuery({
    queryKey: ["manager", "customers"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/customers");
      return response;
    },
  });
};

export const useUpcomingClasses = () => {
  return useQuery({
    queryKey: ["manager", "upcoming-classes"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/upcoming-classes");
      return response;
    },
  });
};

export const useEndingSubscriptions = () => {
  return useQuery({
    queryKey: ["manager", "ending-subscriptions"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/ending-subscriptions");
      return response;
    },
  });
};

export const useExpiredSubscriptionsReport = () => {
  return useQuery({
    queryKey: ["manager", "expired-subscriptions-report"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/manager/expired-subscriptions-report"
      );
      return response;
    },
  });
};

export const useManagerSpecialties = () => {
  return useQuery({
    queryKey: ["manager", "specialties"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/specialties");
      return response;
    },
  });
};
export const useManagerTrainerSpecialties = () => {
  return useQuery({
    queryKey: ["manager", "trainers-specialties"],
    queryFn: async () => {
      const response = await apiClient.get("/manager/trainers-specialties");
      return response;
    },
  });
};
export const useManagerNutritionistsSpecialties = () => {
  return useQuery({
    queryKey: ["manager", "nutritionists-specialties"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/manager/nutritionists-specialties"
      );
      return response;
    },
  });
};

// Mutations
export const useCreateTrainer = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: CreateTrainerDto) => {
      const response = await apiClient.post("/manager/trainer", data);
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useUpdateTrainer = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      trainerId,
      data,
    }: {
      trainerId: string;
      data: UpdateTrainerDto;
    }) => {
      const response = await apiClient.put(
        `/manager/trainer/${trainerId}`,
        data
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useDeleteTrainer = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (trainerId: string) => {
      const response = await apiClient.delete(`/manager/trainer/${trainerId}`);
      return response;
    },
    onSuccess,
    onError,
  });
};
export const useManagerTrainersCustomers = () => {
  return useQuery({
    queryKey: ["manager", "trainer-customers"],
    queryFn: async () => {
      const response = await apiClient.get(`/manager/trainer-customers`);
      return response;
    },
  });
};
export const useManagerNutritionistCustomers = () => {
  return useQuery({
    queryKey: ["manager", "nutritionist -customers"],
    queryFn: async () => {
      const response = await apiClient.get(`/manager/nutritionist -customers`);
      return response;
    },
  });
};

export const useCreateNutritionist = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: CreateNutritionistDto) => {
      const response = await apiClient.post("/manager/nutritionist", data);
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useUpdateNutritionist = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      nutritionistId,
      data,
    }: {
      nutritionistId: string;
      data: UpdateNutritionistDto;
    }) => {
      const response = await apiClient.put(
        `/manager/nutritionist/${nutritionistId}`,
        data
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useDeleteNutritionist = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (nutritionistId: string) => {
      const response = await apiClient.delete(
        `/manager/nutritionist/${nutritionistId}`
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useCreateSubscription = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: CreateSubscriptionPlanDto) => {
      const response = await apiClient.post("/manager/subscription", data);
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useUpdateSubscription = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      data,
    }: {
      subscriptionId: string;
      data: UpdateSubscriptionPlanDto;
    }) => {
      const response = await apiClient.put(
        `/manager/subscription/${subscriptionId}`,
        data
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useDeleteSubscription = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await apiClient.delete(
        `/manager/subscription/${subscriptionId}`
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useCreateSpecialty = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      target: "TRAINER" | "NUTRITIONIST";
    }) => {
      const response = await apiClient.post("/manager/specialty", data);
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useDetachExpired = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete("/manager/expired-subscriptions");
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useDetachCustomerExpired = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (customerId: string) => {
      const response = await apiClient.delete(
        `/manager/expired-subscriptions/${customerId}`
      );
      return response;
    },
    onSuccess,
    onError,
  });
};

export const useUpdatePassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await apiClient.patch("/auth/update-password", data);
      return response;
    },
    onSuccess,
    onError,
  });
};
export const useUpdateName = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: { newName: string }) => {
      const response = await apiClient.patch("/auth/update-name", data);
      return response;
    },
    onSuccess,
    onError,
  });
};
