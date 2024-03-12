import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/error" component={<>Error</>} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
