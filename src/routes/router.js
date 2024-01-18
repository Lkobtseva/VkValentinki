import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tutorial from "../components/Tutorial";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Другие роуты */}
        <Route path="/error" component={Tutorial.ERROR} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
