// import Root from "./Root";
import Root from "@/components/Root";
import { createBrowserRouter } from "react-router";
import Home from "./Home/Home";
import About from "./About";
import Draw from "./Drawing/Draw";
import TanS from "./Table/TanS";

export default createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "draw", Component: Draw },
      { path: "table", Component: TanS },
    ],
  },
]);
