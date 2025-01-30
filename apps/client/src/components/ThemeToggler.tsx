import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggler = () => {
  const theme = useTheme(),
    icon = theme.resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />,
    toggleTheme = () => {
      theme.setTheme(theme.resolvedTheme === "dark" ? "light" : "dark");
    };

  return (
    <Button isIconOnly onPress={toggleTheme} variant="light">
      {icon}
    </Button>
  );
};
