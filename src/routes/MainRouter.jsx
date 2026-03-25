import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Paragraph from "../pages/Paragraph";

export const MainRouter = [
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "paragraph",
        element: <Paragraph />,
      },
    ],
  },
];
