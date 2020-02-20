import Dashboard from "views/Dashboard.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Painel",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
];

export default dashboardRoutes;
