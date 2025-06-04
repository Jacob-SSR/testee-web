import { Routes, Route } from "react-router-dom";
import ListTestees from "../pages/ListTestees";
import AddTestee from "../pages/AddTestee";
import EditTestee from "../pages/EditTestee";
import DetailTestee from "../pages/DetailTestee";
import AddPhysicalTest from "../pages/AddPhysicalTest";
import AddTheoryTest from "../pages/AddTheoryTest";
import AddPracticalTest from "../pages/AddPracticalTest";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ListTestees />} />
    <Route path="/add" element={<AddTestee />} />
    <Route path="/edit/:id" element={<EditTestee />} />
    <Route path="/detail/:id" element={<DetailTestee />} />
    <Route path="/testees/:id" element={<DetailTestee />} />
    <Route path="/physical/:id" element={<AddPhysicalTest />} />
    <Route path="/theory" element={<AddTheoryTest />} />
    <Route path="/practical" element={<AddPracticalTest />} />
  </Routes>
);

export default AppRoutes;
