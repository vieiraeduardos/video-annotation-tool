import Dashboard from "views/Dashboard.jsx";
import PreAnnotation from "views/PreAnnotation.jsx";
import Status from "views/Status.jsx";
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
    path: "/preannotation",
    name: "Anotação de faces",
    icon: "pe-7s-link",
    component: PreAnnotation,
    layout: "/admin"
  },

  {
    path: "/status",
    name: "Estatísticas",
    icon: "pe-7s-graph1",
    component: Status,
    layout: "/admin"
  },

  {
    path: "/verification",
    name: "Grupos",
    icon: "pe-7s-graph1",
    component: Verification,
    layout: "/admin"
  },

  {
    path: "/links",
    name: "Links",
    icon: "pe-7s-graph1",
    component: Link,
    layout: "/admin"
  },
  
];

export default dashboardRoutes;
