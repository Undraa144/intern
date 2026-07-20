const AUTH_ROLE_TAB_KEYS = Object.freeze({
  student: "1",
  employer: "2",
  teacher: "3",
});

export function getAuthRoleTabKey(role) {
  return AUTH_ROLE_TAB_KEYS[role] ?? AUTH_ROLE_TAB_KEYS.student;
}
