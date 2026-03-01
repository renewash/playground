// import Root from "./Root";
import Root from "@/components/Root";
import { createBrowserRouter } from "react-router";
import Home from "./Home/Home";
import About from "./About";
// import Draw from "./Drawing/Draw";
import DrawProdA from "./DrawProdA/DrawProdA";
import TanS from "./Table/MainTable";

export default createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      // { path: "draw", Component: Draw },
      { path: "drawproda", Component: DrawProdA },
      { path: "table", Component: TanS },
    ],
  },
]);
