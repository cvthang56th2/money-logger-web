import { createWebHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import ListTransactions from "./views/ListTransactions.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/transactions",
    name: "ListTransactions",
    component: ListTransactions,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;