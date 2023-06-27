import { Route, Routes } from "react-router";
import MyDao from "./components/members/MyMembers";
import Members from "./pages/Members";
import Proposals from "./pages/Proposals";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/proposals" element={<Proposals />} />
            </Routes>
        </>
    );
}

export default App;
