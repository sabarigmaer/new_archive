import { BrowserRouter, Route, Routes } from "react-router";
import Archive from "./pages/Archive";
import Upload from "./pages/Upload";
import Home from "./pages/Home";
import Header from "./components/Header";
import Gallery from "./pages/Gallery";
import Rule34 from "./pages/Rule34";
import Luscious from "./pages/Luscious";
import LusciousHome from "./pages/LusciousHome";
import EHentai from "./pages/EHentai";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/upload/:id" element={<Upload />} />
        <Route path="/gallery/:id" element={<Gallery />} />
        <Route path="/ehentai/:id" element={<EHentai />} />
        <Route path="/rule34/:id" element={<Rule34 />} />
        <Route path="/luscious" element={<LusciousHome/>} />
        <Route path="/luscious/:id" element={<Luscious/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
