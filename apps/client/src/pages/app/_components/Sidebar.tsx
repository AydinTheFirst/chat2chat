import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import {
  LucideHome,
  LucideLogOut,
  LucideSidebar,
  LucideUserPlus,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useMedia } from "react-use";
import { toast } from "sonner";
import useSWR from "swr";

import { ThemeToggler } from "@/components";
import { useAuth } from "@/providers/AuthProvider";
import { Channel } from "@/types";

// Context
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
    isOpen: false,
    setIsOpen: () => {},
    toggleSidebar: () => {},
  }),
  useSidebar = () => React.useContext(SidebarContext);

// Types
interface SidebarItemProps {
  channel: Channel;
}

interface SidebarGroupProps {
  items: SidebarItemProps[];
  title: string;
}

interface AppSidebarProps {
  children: React.ReactNode;
}

// Components
const Header = () => {
  const { channelId } = useParams();

  const copyChannelId = async () => {
    await navigator.clipboard.writeText(channelId!);
    toast.success("Channel ID copied to clipboard");
  };

  return (
    <Card radius="none">
      <CardHeader className="justify-between gap-3">
        <SidebarToggler />
        {channelId && (
          <Button isIconOnly onPress={copyChannelId} variant="light">
            <LucideUserPlus />
          </Button>
        )}
      </CardHeader>
    </Card>
  );
};

const Sidebar = () => {
  const { isOpen } = useSidebar();

  const Body = () => {
    const { data: channels } = useSWR<Channel[]>("/channels");

    if (!channels) return null;

    return (
      <CardBody className="flex flex-col gap-6">
        <SidebarGroup
          items={channels.map((channel) => ({ channel }))}
          title="Channels"
        />
      </CardBody>
    );
  };

  const Footer = () => {
    const { logout, user } = useAuth();

    if (!user) {
      return null;
    }

    return (
      <CardFooter className="justify-between">
        <Dropdown>
          <DropdownTrigger>
            <button className="flex flex-1 justify-start">
              <User description={user.email} name={`${user.displayName}`} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem href="/" key="home" startContent={<LucideHome />}>
              Anasayfa
            </DropdownItem>
            <DropdownItem
              key="logout"
              onPress={logout}
              startContent={<LucideLogOut />}
            >
              Çıkış Yap
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <ThemeToggler />
      </CardFooter>
    );
  };

  const Header = () => (
    <CardHeader className="justify-between">
      <Link className="flex items-center gap-2" to={"/app"}>
        <img alt="HeroUI" className="h-10" src="/logo.png" />
        <h1 className="text-lg font-bold">Chat2Chat</h1>
      </Link>
      <SidebarToggler className="md:hidden" />
    </CardHeader>
  );

  return (
    <Card
      as={"aside"}
      className={cn("col-span-12 h-dvh md:col-span-3 lg:col-span-2", {
        hidden: !isOpen,
      })}
      radius="none"
    >
      <Header />
      <Body />
      <Divider />
      <Footer />
    </Card>
  );
};

const SidebarGroup = (props: SidebarGroupProps) => (
  <div className="grid gap-3">
    <h4 className={cn("text-sm font-semibold")}>{props.title}</h4>
    <div className="grid gap-1">
      {props.items.map((item, index) => (
        <SidebarItem key={index} {...item} />
      ))}
    </div>
  </div>
);

const SidebarItem = ({ channel }: SidebarItemProps) => {
  const location = useLocation();
  return (
    <Card
      as={Link}
      isDisabled={location.pathname === `/app/${channel.id}`}
      isHoverable
      isPressable
      to={`/app/${channel.id}`}
    >
      <CardBody className="grid grid-cols-12 gap-3">
        <Avatar className="col-span-2" name={channel.name} />
        <div className="col-span-10 flex flex-col justify-start">
          <h4 className="font-semibold">{channel.name}</h4>
          <p className="truncate text-xs text-foreground-500">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio nisi
            accusantium repellendus molestias hic deleniti, dolorum modi earum
            fugiat ut aperiam impedit quo minus delectus inventore natus
            quisquam aliquid quae.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

const SidebarToggler = (props: { className?: string }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={props.className}
      isIconOnly
      onPress={toggleSidebar}
      variant="light"
    >
      <LucideSidebar className="transition-all" />
    </Button>
  );
};

export default function AppSidebar(props: AppSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false),
    isMobile = useMedia("(max-width: 768px)"),
    location = useLocation(),
    toggleSidebar = () => {
      setIsOpen((open) => !open);
      localStorage.setItem("isSidebarOpen", JSON.stringify(!isOpen));
    };

  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  React.useEffect(() => {
    const isSidebarOpen = JSON.parse(
      localStorage.getItem("isSidebarOpen") || "false",
    );

    if (isMobile) {
      return setIsOpen(false);
    }
    setIsOpen(isSidebarOpen);
  }, [isMobile, location.pathname]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      <div className="grid grid-cols-12">
        <Sidebar />
        <div
          className={cn("col-span-12", {
            "md:col-span-9 lg:col-span-10": isOpen,
          })}
        >
          <div className="flex h-dvh flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">{props.children}</main>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
