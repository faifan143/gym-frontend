import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectUser, selectAccessToken } from "@/cache/slices/userSlice";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/auth");
    }
  }, [user, accessToken]);

  return { user, accessToken };
};
