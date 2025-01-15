"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell } from "lucide-react";
import LoginForm from "@/components/common/LoginForm";
import Register from "@/components/common/Register";
import GymBackground from "@/components/common/GymBackground";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 rtl">
      <GymBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-blue-50 text-blue-500"
            >
              <Dumbbell size={32} />
            </motion.div>

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? "أهلاً بك" : "إنشاء حساب"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {isLogin
                ? "أدخل بيانات حسابك للمتابعة"
                : "قم بإدخال بياناتك لإنشاء حساب جديد"}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {isLogin ? (
                  <LoginForm />
                ) : (
                  <Register
                    onSuccess={() => {
                      setIsLogin(true);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 w-full">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isLogin ? "إنشاء حساب زبون" : "لدي حساب بالفعل"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
