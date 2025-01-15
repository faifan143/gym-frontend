import { logout } from "@/cache/slices/userSlice";
import { AppDispatch, RootState } from "@/cache/store";
import { useUpdateName, useUpdatePassword } from "@/hooks/useManager";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMokkBar } from "../providers/Mokkbar";

const ProfileTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const username = useSelector((state: RootState) => state.user.name);
  const [name, setName] = useState(username);

  const dispatch = useDispatch<AppDispatch>();

  const { mutateAsync: updateName, isPending: isNameUpdating } = useUpdateName({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحديث الاسم بنجاح",
      });
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "فشل في تحديث الاسم",
      });
    },
  });

  const { mutateAsync: updatePassword, isPending: isPasswordUpdating } =
    useUpdatePassword({
      onSuccess: () => {
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم تغيير كلمة المرور بنجاح",
        });
        setOldPassword("");
        setNewPassword("");
      },
      onError: (error) => {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message: error?.response?.data?.message || "فشل في تغيير كلمة المرور",
        });
      },
    });

  const handleUpdateName = async () => {
    if (!name?.trim()) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "لا يمكن أن يكون الاسم فارغًا",
      });
      return;
    }

    if (name === username) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "الرجاء إدخال اسم مختلف عن الاسم الحالي",
      });
      return;
    }

    try {
      await updateName({ newName: name });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال كلمتي المرور القديمة والجديدة",
      });
      return;
    }

    if (oldPassword === newPassword) {
      setSnackbarConfig({
        open: true,
        severity: "warning",
        message: "يجب أن تكون كلمة المرور الجديدة مختلفة عن القديمة",
      });
      return;
    }

    if (newPassword.length < 6) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل",
      });
      return;
    }

    try {
      await updatePassword({ oldPassword, newPassword });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleLogout = () => {
    setSnackbarConfig({
      open: true,
      severity: "info",
      message: "تم تسجيل الخروج بنجاح",
    });
    dispatch(logout());
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-right">
        إعدادات الملف الشخصي
      </h2>

      <div className="mb-6 text-right">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تحديث الاسم
        </label>
        <input
          type="text"
          value={name!}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل الاسم الجديد"
          className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isNameUpdating}
        />
        <button
          onClick={handleUpdateName}
          className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
          disabled={isNameUpdating}
        >
          {isNameUpdating ? "جاري التحديث..." : "تحديث الاسم"}
        </button>
      </div>

      <div className="mb-6 text-right">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          تغيير كلمة المرور
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="أدخل كلمة المرور الحالية"
          className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
          disabled={isPasswordUpdating}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="أدخل كلمة المرور الجديدة"
          className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isPasswordUpdating}
        />
        <button
          onClick={handleUpdatePassword}
          className="mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition disabled:bg-green-300"
          disabled={isPasswordUpdating}
        >
          {isPasswordUpdating ? "جاري التحديث..." : "تغيير كلمة المرور"}
        </button>
      </div>

      <div className="text-right">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
