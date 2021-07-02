import Dashboard from "views/Dashboard.jsx";
import PreAnnotation from "views/PreAnnotation.jsx";
//import AnnotateDescriptionToScenes from "views/AnnotateDescriptionToScenes.jsx";
import Verification from "views/Verification.jsx";
import Link from "views/Links.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Início",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },

  {
    path: "/faceannotation/",
    name: "Anotar rostos",
    icon: "pe-7s-link",
    component: PreAnnotation,
    layout: "/admin"
  },

  {
    path: "/verification",
    name: "Grupos",
    icon: "pe-7s-users",
    component: Verification,
    layout: "/admin"
  },

  {
    path: "/links",
    component: Link,
    layout: "/admin"
  },
  
];

export default dashboardRoutes;
