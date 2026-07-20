import assert from "node:assert/strict";
import test from "node:test";

import { getSelectedMenuKey } from "./mainLayoutNavigation.js";

test("selects the menu item whose path matches the refreshed URL", () => {
  const menuItems = [
    { key: "1", path: "/pages/student/home" },
    { key: "2", path: "/pages/student/search" },
    { key: "3", path: "/pages/student/request" },
  ];

  assert.equal(getSelectedMenuKey(menuItems, "/pages/student/request"), "3");
});

test("does not select the overview item when the URL is not a menu destination", () => {
  const menuItems = [
    { key: "1", path: "/pages/teacher/home" },
    { key: "2", path: "/pages/teacher/company" },
  ];

  assert.equal(getSelectedMenuKey(menuItems, "/pages/teacher/studentprofile"), undefined);
});
