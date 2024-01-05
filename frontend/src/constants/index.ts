export const logos = {
  'he_group': '/assets/images/hegroup.png',
  'x_wear': '/assets/images/xwear.png',
  'the_logician': '/assets/images/logician.png'
};
type DomainLinks = {
  [domain: string]: {
    imgURL: string;
    route: string;
    label: string;
  }[];
};
export const domainSidebarLinks: DomainLinks = {
  'he_group': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/posts/technology",
      label: "Technology",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/posts/invention",
      label: "Invention",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
    {
      imgURL: "/assets/icons/people.svg",
      route: "/users",
      label: "Users",
    },
  ],
  'x_wear': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
  ],
  'the_logician': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Logician Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
  ],
};

export const domainbottombarLinks: DomainLinks = {
  'he_group': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/technology",
      label: "Technology",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/invention",
      label: "Invention",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
  ],
  'x_wear': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
  ],
  'the_logician': [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
      label: "Logician Dashboard",
    },
    {
      imgURL: "/assets/icons/wallpaper.svg",
      route: "/media",
      label: "Media",
    },
  ],
};

export const bottombarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Dashboard",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/technology",
    label: "Technology",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/users",
    label: "Users",
  },
];