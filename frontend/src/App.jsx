import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
      </Routes>
    </Router>
  );
}

export default App;