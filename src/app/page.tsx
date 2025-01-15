"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth");
  }, []);
  return <div></div>;
};

export default Home;
