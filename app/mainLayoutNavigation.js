export function getSelectedMenuKey(menuItems, pathname) {
  return menuItems.find((menuItem) => menuItem.path === pathname)?.key;
}
