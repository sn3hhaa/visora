export interface NavItem {
  label: string;
  href: string;
  isAnchor?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "The Platform", href: "/#platform", isAnchor: true },
  { label: "Contexts", href: "/#contexts", isAnchor: true },
  { label: "Performance", href: "/#performance", isAnchor: true },
];

export const FOOTER_NAV_ITEMS = {
  navigation: [
    { label: "The Platform", href: "/#platform" },
    { label: "Contexts", href: "/#contexts" },
    { label: "Performance", href: "/#performance" },
  ],
  product: [
    { label: "Try Visora", href: "/setup" },
    { label: "Interview", href: "/setup" },
    { label: "Performance Review", href: "/#performance" },
  ],
  external: [
    { label: "GitHub", href: "https://github.com", external: true },
  ],
};

