import Dashboard from "views/Dashboard.jsx";
import NewPeople from "views/NewPeople.jsx";
import Verification from "views/Verification.jsx";
import PreAnnotation from "views/PreAnnotation.jsx";
import Status from "views/Status.jsx";
import Videos from "views/Videos.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Painel",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },

  {
    path: "/newpeople",
    name: "Novo Ator",
    icon: "pe-7s-add-user",
    component: NewPeople,
    layout: "/admin"
  },

  {
    path: "/verification",
    name: "Verificação",
    icon: "pe-7s-check",
    component: Verification,
    layout: "/admin"
  },

  {
    path: "/preannotation",
    name: "Pré-anotação",
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
    path: "/videos",
    name: "Videos",
    icon: "pe-7s-graph1",
    component: Videos,
    layout: "/admin"
  },
];

export default dashboardRoutes;
