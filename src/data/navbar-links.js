import { ACCOUNT_TYPE } from "../utils/constants";

export const NavbarLinks = [
  { id: 1, title: "Home", path: "/", roles: [ACCOUNT_TYPE.ALL] },
  { id: 2, title: "Catalog", path: "/catalog", roles: [ACCOUNT_TYPE.ALL] },
  { id: 3, title: "About Us", path: "/about", roles: [ACCOUNT_TYPE.ALL] },
  { id: 4, title: "Contact Us", path: "/contact", roles: [ACCOUNT_TYPE.ALL] },
  { id: 5, title: "Courses", path: "/allcourses", roles: [ACCOUNT_TYPE.ADMIN] },
  { id: 6, title: "Users", path: "/allusers", roles: [ACCOUNT_TYPE.ADMIN] },
];
