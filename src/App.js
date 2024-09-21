import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AppStartup from "./pages/app.startup/app.startup";
import ViewContainerWrapper from "./pages/view.container/view.container";

function App() {
  return (
      <div>
          <Router>
              <Routes>
                  <Route path = "/" exact element = {<AppStartup />} />
                  <Route path = "/home" exact element = {<ViewContainerWrapper />} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
