// components/auth/Register.tsx
"use client";

import { apiClient } from "@/utils/axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useMokkBar } from "../providers/Mokkbar";

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

const Register = ({ onSuccess }: { onSuccess: () => void }) => {
  const { setSnackbarConfig } = useMokkBar();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!credentials.name.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال الاسم",
      });
      setIsSubmitting(false);
      return;
    }

    if (!credentials.email.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال البريد الإلكتروني",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يرجى إدخال بريد إلكتروني صحيح",
      });
      setIsSubmitting(false);
      return;
    }

    if (credentials.password.length < 6) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await apiClient.post("/auth/register", credentials);
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إنشاء الحساب بنجاح",
      });
      onSuccess();
    } catch (err: any) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "حدث خطأ في التسجيل",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <User size={20} />
          </div>
          <input
            dir="rtl"
            type="text"
            name="name"
            required
            className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="الاسم"
            value={credentials.name}
            onChange={handleChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Mail size={20} />
          </div>
          <input
            dir="rtl"
            type="email"
            name="email"
            required
            className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="البريد الإلكتروني"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Lock size={20} />
          </div>
          <input
            dir="rtl"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={6}
            className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="كلمة المرور"
            value={credentials.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500 text-right">
          كلمة المرور يجب أن تكون 6 أحرف على الأقل
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>
      </motion.div>
    </form>
  );
};

export default Register;
