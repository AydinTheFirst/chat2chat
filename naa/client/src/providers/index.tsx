import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useHref, useNavigate } from "react-router-dom";
import { Toaster, ToasterProps } from "sonner";
import { SWRConfig } from "swr";

import http from "@/http";

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
          {children}
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
  return <Toaster richColors theme={theme as ToasterProps["theme"]} />;
};
