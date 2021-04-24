export type MenuItemType = {
  name: string;
  icon: {
    name: string;
    color: string;
  };
};

export type MenuGroupType = {
  name: null | string;
  items: MenuItemType[];
};
