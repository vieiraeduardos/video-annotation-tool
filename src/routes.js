import Dashboard from "views/Dashboard.jsx";
import NewPeople from "views/NewPeople.jsx";
import Verification from "views/Verification.jsx";
import PreAnnotation from "views/PreAnnotation.jsx";

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
    icon: "pe-7s-graph",
    component: NewPeople,
    layout: "/admin"
  },

  {
    path: "/verification",
    name: "Verificação",
    icon: "pe-7s-graph",
    component: Verification,
    layout: "/admin"
  },

  {
    path: "/preannotation",
    name: "Pré-anotação",
    icon: "pe-7s-graph",
    component: PreAnnotation,
    layout: "/admin"
  },
];

export default dashboardRoutes;
