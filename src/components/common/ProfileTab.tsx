import { logout, setSliceName, setSlicePhoto } from "@/cache/slices/userSlice";
import { AppDispatch, RootState } from "@/cache/store";
import {
  useUpdateName,
  useUpdatePassword,
  useUpdatePhoto,
} from "@/hooks/useManager";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Camera, Edit2, Key, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMokkBar } from "../providers/Mokkbar";

const ProfileTab = () => {
  const { setSnackbarConfig } = useMokkBar();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { name: username, photo } = useSelector(
    (state: RootState) => state.user
  );
  const [name, setName] = useState(username);
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState(photo);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch<AppDispatch>();

  const { mutateAsync: updateName, isPending: isNameUpdating } = useUpdateName({
    onSuccess: (userData) => {
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحديث الاسم بنجاح",
      });
      dispatch(setSliceName(userData.name));
      console.log("user data : ", userData);
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

  const { mutateAsync: updatePhoto, isPending: isPhotoUpdating } =
    useUpdatePhoto({
      onSuccess: (userData: { photo: string }) => {
        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم تحديث الصورة بنجاح",
        });
        if (userData) {
          dispatch(setSlicePhoto(userData.photo));
        }
        setSelectedFile(null);
      },
      onError: (error) => {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message: error?.response?.data?.message || "فشل في تحديث الصورة",
        });
        setPreviewImage(photo); // Reset preview on error
      },
    });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("photo", selectedFile);
    try {
      await updatePhoto(formData);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

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
    queryClient.resetQueries();
    dispatch(logout());
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={previewImage}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 text-white hover:bg-blue-600 transition"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
                <p className="text-gray-500">مدير النظام</p>
              </div>
            </div>
            {selectedFile && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdatePhoto}
                className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
                disabled={isPhotoUpdating}
              >
                {isPhotoUpdating ? "جاري التحديث..." : "حفظ الصورة"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Update Name Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Edit2 className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                تحديث الاسم
              </h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={name!}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل الاسم الجديد"
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                disabled={isNameUpdating}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateName}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition disabled:bg-blue-300 flex items-center justify-center gap-2"
                disabled={isNameUpdating}
              >
                <Edit2 className="w-4 h-4" />
                {isNameUpdating ? "جاري التحديث..." : "تحديث الاسم"}
              </motion.button>
            </div>
          </motion.div>

          {/* Update Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                تغيير كلمة المرور
              </h2>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الحالية"
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50"
                disabled={isPasswordUpdating}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50"
                disabled={isPasswordUpdating}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdatePassword}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition disabled:bg-green-300 flex items-center justify-center gap-2"
                disabled={isPasswordUpdating}
              >
                <Key className="w-4 h-4" />
                {isPasswordUpdating ? "جاري التحديث..." : "تغيير كلمة المرور"}
              </motion.button>
            </div>
          </motion.div>

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  تسجيل الخروج
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileTab;
