import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// Fetch all trainer's classes
export const useTrainerClasses = () => {
  return useQuery({
    queryKey: ["trainer", "classes"],
    queryFn: async () => {
      const response = await apiClient.get("/trainer/classes");
      return response;
    },
  });
};

// Fetch details of a specific class
export const useClassDetails = (classId: string) => {
  return useQuery({
    queryKey: ["trainer", "class", classId],
    queryFn: async () => {
      const response = await apiClient.get(`/trainer/class/${classId}`);
      return response;
    },
    enabled: !!classId, // Prevent query from running without a classId
  });
};

// Fetch all customers of a specific class
export const useClassCustomers = (classId: string) => {
  return useQuery({
    queryKey: ["trainer", "class", classId, "customers"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/trainer/class/${classId}/customers`
      );
      return response;
    },
    enabled: !!classId, // Prevent query from running without a classId
  });
};

// Create a new class
export const useCreateClass = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      schedule: Array<{ day: string; time: string }>;
      capacity: number;
    }) => {
      const response = await apiClient.post("/trainer/class", data);
      return response;
    },
    onSuccess,
  });
};

// Update an existing class
export const useUpdateClass = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: {
        name?: string;
        schedule?: Array<{ day: string; time: string }>;
        maxCapacity?: number;
      };
    }) => {
      const response = await apiClient.put(`/trainer/class/${classId}`, data);
      return response;
    },
    onSuccess,
  });
};

// Delete a class
export const useDeleteClass = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiClient.delete(`/trainer/class/${classId}`);
      return response;
    },
    onSuccess,
  });
};

// Remove a customer from a class
export const useRemoveCustomerFromClass = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  return useMutation({
    mutationFn: async ({
      classId,
      customerId,
    }: {
      classId: string;
      customerId: string;
    }) => {
      const response = await apiClient.delete(
        `/trainer/class/${classId}/customer/${customerId}`
      );
      return response;
    },
    onSuccess,
  });
};

// Fetch attendance for a specific class schedule
export const useClassScheduleAttendance = ({
  classId,
  scheduleId,
}: {
  classId: string;
  scheduleId: string;
}) => {
  return useQuery({
    queryKey: ["trainer", "class", classId, "attendance", scheduleId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/trainer/class/${classId}/attendance/${scheduleId}`
      );
      return response;
    },
    enabled: !!classId && !!scheduleId, // Prevent query from running without necessary params
  });
};

// Mark attendance for a specific customer
export const useMarkAttendance = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async ({
      classId,
      scheduleId,
      customerId,
    }: {
      classId: string;
      scheduleId: string;
      customerId: string;
    }) => {
      console.log("classId : " + classId);
      console.log("scheduleId : " + scheduleId);
      console.log("customerId: " + customerId);

      const response = await apiClient.post(
        `/trainer/class/${classId}/attendance/${scheduleId}/customerId/${customerId}`
      );
      return response;
    },
    onSuccess,
  });
};
