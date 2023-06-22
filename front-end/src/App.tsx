
import "./App.css";
import { Route, Routes } from "react-router";
import MyDao from "./components/dao/MyDao";
import Members from "./pages/Members";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<MyDao />} />
                <Route path="/members" element={<Members />} />
            </Routes>
        </>
    );
}

export default App;
