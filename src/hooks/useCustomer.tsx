import { apiClient } from "@/utils/axios";
import { useQuery, useMutation } from "@tanstack/react-query";

// Queries
export const useAllClasses = () => {
  return useQuery({
    queryKey: ["customer", "all-classes"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/all-classes");
      return response;
    },
  });
};

export const useMyClasses = () => {
  return useQuery({
    queryKey: ["customer", "my-classes"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/my-classes");
      return response;
    },
  });
};

export const useAllPlans = () => {
  return useQuery({
    queryKey: ["customer", "all-plans"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/all-plans");
      return response;
    },
  });
};

export const useMyPlans = () => {
  return useQuery({
    queryKey: ["customer", "my-plans"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/my-plans");
      return response;
    },
  });
};

export const useAllSubscriptions = () => {
  return useQuery({
    queryKey: ["customer", "all-subscriptions"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/all-subscriptions");
      return response;
    },
  });
};

export const useMySubscription = () => {
  return useQuery({
    queryKey: ["customer", "my-subscription"],
    queryFn: async () => {
      const response = await apiClient.get("/customer/my-subscription");
      return response;
    },
  });
};

// Mutations
export const useMakePayment = ({
  onError,
  onSuccess,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({ subscriptionId }: { subscriptionId: string }) => {
      const response = await apiClient.post(
        `/customer/subscribe/${subscriptionId}`
      );
      return response;
    },
    onError,
    onSuccess,
  });
};

export const useAttendClass = ({
  onError,
  onSuccess,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      const response = await apiClient.post(
        `/customer/attend-class/${classId}`
      );
      return response;
    },
    onError,
    onSuccess,
  });
};

export const useEnrollPlan = ({
  onError,
  onSuccess,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      const response = await apiClient.post(`/customer/enroll-plan/${planId}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
