import Dashboard from "views/Dashboard.jsx";
import NewPeople from "views/NewPeople.jsx";
import Verification from "views/Verification.jsx";
import PreAnnotation from "views/PreAnnotation.jsx";
import Status from "views/Status.jsx";
import Videos from "views/Videos.jsx";

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
    name: "Pré-anotação de faces",
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

  
];

export default dashboardRoutes;
