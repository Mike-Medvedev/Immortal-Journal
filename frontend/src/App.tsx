import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Journal from "./Journal";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/journal",
    element: <Journal />,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
