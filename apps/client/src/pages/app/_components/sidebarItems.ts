import Icon from "@/components/Icon";

export const sidebarItems = [
  {
    icon: Icon({ name: "House" }),
    title: "Yönetim Paneli",
    url: "/dashboard",
  },
  {
    canCreate: true,
    icon: Icon({ name: "Megaphone" }),
    title: "Duyurular",
    url: "/dashboard/posts",
  },
  {
    canCreate: true,
    icon: Icon({ name: "Users" }),
    title: "Kullanıcılar",
    url: "/dashboard/users",
  },
  {
    icon: Icon({ name: "Clock" }),
    title: "Giriş-Çıkış",
    url: "/dashboard/timelogs",
  },
  {
    icon: Icon({ name: "AlarmClock" }),
    title: "Vardiyalar",
    url: "/dashboard/shifts",
  },
  {
    canCreate: true,
    icon: Icon({ name: "Users" }),
    title: "Birimler",
    url: "/dashboard/units",
  },
  {
    canCreate: true,
    icon: Icon({ name: "ListCheck" }),
    title: "Görevler",
    url: "/dashboard/tasks",
  },
  {
    icon: Icon({ name: "Settings2" }),
    title: "Ayarlar",
    url: "/dashboard/settings",
  },
  {
    icon: Icon({ name: "BadgeHelp" }),
    title: "Yardım",
    url: "/dashboard/help",
  },
];
