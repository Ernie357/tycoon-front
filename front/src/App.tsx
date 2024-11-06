import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Game from "./pages/Game/Game";

const App: React.FC = () => {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/:id" element={<Game />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;