export enum Specialty {
  STRENGTH_TRAINING = "STRENGTH_TRAINING",
  CARDIO = "CARDIO",
  YOGA = "YOGA",
  CROSSFIT = "CROSSFIT",
  HIIT = "HIIT",
  SPORTS_NUTRITION = "SPORTS_NUTRITION",
  WEIGHT_MANAGEMENT = "WEIGHT_MANAGEMENT",
  CLINICAL_NUTRITION = "CLINICAL_NUTRITION",
  HOLISTIC_NUTRITION = "HOLISTIC_NUTRITION",
}

export enum SubscriptionLevel {
  BASIC = "BASIC",
  VIP = "VIP",
  PREMIUM = "PREMIUM",
}

export enum SubscriptionDuration {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  ANNUAL = "ANNUAL",
}

// types/nutritionist.ts

// Schedule Item type
export interface ScheduleItemDto {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  time: string; // HH:mm format
}

// Create Plan DTO
export interface CreateNutritionPlanDto {
  planDetails: string; // max 1000 chars
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  customerId: number;
}

// Update Plan DTO
export interface UpdateNutritionPlanDto {
  planDetails?: string; // max 1000 chars
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

// Response types
export interface NutritionPlan {
  id: number;
  planDetails: string;
  startDate: string;
  endDate: string;
  customerId: number;
  nutritionistId: number;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  // Add other customer fields as needed
}

// Validation utilities
export const isValidTimeFormat = (time: string): boolean => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

export const isValidWeekday = (day: string): day is ScheduleItemDto["day"] => {
  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return validDays.includes(day as ScheduleItemDto["day"]);
};

// Example validation function
export const validateNutritionPlanDto = (
  data: Partial<CreateNutritionPlanDto>
): string[] => {
  const errors: string[] = [];

  if (!data.planDetails) {
    errors.push("Plan details are required");
  } else if (data.planDetails.length > 1000) {
    errors.push("Plan details should not exceed 1000 characters");
  }

  if (!data.startDate) {
    errors.push("Start date is required");
  }

  if (!data.endDate) {
    errors.push("End date is required");
  }

  if (!data.customerId) {
    errors.push("Customer ID is required");
  }

  // Add additional validation as needed

  return errors;
};
