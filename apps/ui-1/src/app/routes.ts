// import Root from "./Root";
import Root from "@/components/Root";
import { createBrowserRouter } from "react-router";
import Home from "./Home/Home";
import About from "./About";
import DrawModule from "./DrawModule/DrawModule";
import Tld from "./Tld/Tld";
import Storage from "./Storage/Storage";
import TanS from "./Table/MainTable";

export default createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "DrawModule", Component: DrawModule },
      { path: "table", Component: TanS },
      { path: "Storage", Component: Storage },
      { path: "Tld", Component: Tld },
    ],
  },
]);
