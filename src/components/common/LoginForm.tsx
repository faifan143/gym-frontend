import { loginUser } from "@/cache/slices/userSlice";
import type { AppDispatch, RootState } from "@/cache/store";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMokkBar } from "../providers/Mokkbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Form Schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Types
type LoginFormInputs = yup.InferType<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);

    try {
      const response = await dispatch(loginUser(data)).unwrap();
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تسجيل الدخول بنجاح",
      });
      console.log("Login successful:", response);
    } catch (error: unknown) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: (error as { message?: string })?.message || "فشل تسجيل الدخول",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const roleRedirectMap: Record<string, string> = {
      MANAGER: "/manager",
      TRAINER: "/trainer",
      NUTRITIONIST: "/nutritionist",
      CUSTOMER: "/customer",
    };

    if (role && roleRedirectMap[role]) {
      router.replace(roleRedirectMap[role]);
    }
  }, [role, router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <Mail size={20} />
        </div>
        <input
          dir="rtl"
          type="email"
          {...register("email")}
          className={`block w-full rounded-lg border py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors.email
              ? "border-red-500 bg-red-50 focus:border-red-500"
              : "border-gray-200 bg-gray-50 focus:border-blue-500"
          }`}
          placeholder="أدخل بريدك الإلكتروني"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 text-right">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <Lock size={20} />
        </div>
        <input
          dir="rtl"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          className={`block w-full rounded-lg border py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            errors.password
              ? "border-red-500 bg-red-50 focus:border-red-500"
              : "border-gray-200 bg-gray-50 focus:border-blue-500"
          }`}
          placeholder="أدخل كلمة المرور"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500 text-right">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
      >
        {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
};

export default LoginForm;
