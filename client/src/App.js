import Editor from "./components/editor";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact  element={<Navigate to={`/document/${uuidv4()}`}/>}>
            {/* (redirect to ={`/document/${uuidv4()}}`}) */}
          </Route>
          <Route path="/document/:id" element={<Editor/>}/>
        </Routes>
        
      </Router>
      
    </div>
  );
}

export default App;
