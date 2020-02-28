import Dashboard from "views/Dashboard.jsx";
import NewPeople from "views/NewPeople.jsx";

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
];

export default dashboardRoutes;
