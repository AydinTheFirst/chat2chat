import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useHref, useNavigate } from "react-router-dom";
import { Toaster, ToasterProps } from "sonner";
import { SWRConfig } from "swr";

import http from "@/lib/http";

import { AuthProvider } from "./AuthProvider";
import SocketProvider from "./SocketProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  return (
    <HeroUIProvider
      navigate={navigate}
      useHref={useHref}
      validationBehavior="native"
    >
      <NextThemesProvider attribute="class" defaultTheme="light">
        <SwrProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
          <ToastProvider />
        </SwrProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

const SwrProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: http.fetcher,
        onError: http.handleError,
      }}
    >
      {children}
    </SWRConfig>
  );
};

const ToastProvider = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-center"
      richColors
      theme={theme as ToasterProps["theme"]}
    />
  );
};
