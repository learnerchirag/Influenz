import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Edit from "views/examples/Edit.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Forgot from "views/examples/Forgot.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Edit,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/",
  },
  {
    path: "register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/",
  },
  {
    path: "forgot",
    name: "Forgot",
    icon: "ni ni-tv-2 text-primary",
    component: Forgot,
    layout: "/",
  },
];
export default routes;
