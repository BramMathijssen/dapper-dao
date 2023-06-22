import "./App.css";
import { Route, Routes } from "react-router";
import MyDao from "./components/dao/MyDao";
import Members from "./pages/Members";
import Proposals from "./pages/Proposals";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyDao />} />
                <Route path="/members" element={<Members />} />
                <Route path="/proposals" element={<Proposals />} />
            </Routes>
        </>
    );
}

export default App;
