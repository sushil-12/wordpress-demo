export const logos = {
  'he_group': '/assets/images/logo-dashboard.svg',
  'x_wear': '/assets/images/xwear.png',
  'the_logician': '/assets/images/logician.png'
};

export const websites = {
  'he_group': '/assets/images/hegroup.svg',
  'x_wear': '/assets/images/xwear.svg',
  'the_logician': '/assets/images/logician.svg',
}


type SubCategoryLink = {
  imgURL: string;
  route: string;
  label: string;
};

type DomainLink = {
  imgURL: string;
  route: string;
  label: string;
  subcategory?: SubCategoryLink[];
};

type DomainLinks = {
  [domain: string]: DomainLink[] | {
    [subdomain: string]: DomainLink[];
  };
};
export const websiteMenus = [
  {
    imgURL: "/assets/icons/media.svg",
    route: "/media",
    label: "Media",
  },
  {
    imgURL: "/assets/icons/pages.svg",
    route: "/pages",
    label: "Pages",
  },
  {
    imgURL: "/assets/icons/posts.svg",
    route: "/posts",
    label: "Posts",
  },
  {
    imgURL: "/assets/icons/plugins.svg",
    route: "/plugins",
    label: "Plugins",
  },
];
export const domainSidebarLinks: DomainLinks = {
  comman: [
    {
      imgURL: "/assets/icons/dashboard.svg",
      route: "/",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/personal.svg",
      route: "/personal-statistics",
      label: "Personal Statistic",
      subcategory:[
        {
          imgURL: "/assets/icons/personal.svg",
          route: "/personal-statistics",
          label: "Personal Statistic",
        }
      ]
    },
    {
      imgURL: "/assets/icons/Briefcase.svg",
      route: "/buisness-statistics",
      label: "Business Statistic",
      subcategory:[
        {
          imgURL: "/assets/icons/Briefcase.svg",
          route: "/buisness-statistics",
          label: "Business Statistic",
        }
      ]
    },
  ],
  
  websites: {
    he_group: [
      ...websiteMenus,
    ],
    x_wear: [
      ...websiteMenus,
    ],
    the_logician: [
      ...websiteMenus,
    ],
  },
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