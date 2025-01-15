"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { persistor, store } from "@/cache/store";
import LoadingProvider from "@/hooks/LoadingProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AuthGuard from "./AuthGuard";
import { MokkBarProvider } from "./Mokkbar";

const LayoutProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 30,
                retry: 1,
                refetchOnWindowFocus: false,
              },
            },
          })
        }
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingProvider>
              <AuthGuard>
                <MokkBarProvider>{children}</MokkBarProvider>
              </AuthGuard>
            </LoadingProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </div>
  );
};

export default LayoutProviders;
