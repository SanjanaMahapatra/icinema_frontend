import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Router from "./components/layout/Router";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AuthProvider>
          <Layout>
            <Router />
          </Layout>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;