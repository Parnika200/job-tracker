
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from './componants/ProtectedRoute';
import FindJobs from "./pages/FindJobs";
import Tracker from "./pages/Tracker";
import Analytics from './pages/Analytics';
import Home from './pages/Home';
function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
 path="/jobs"
 element={
   <ProtectedRoute>
     <FindJobs />
   </ProtectedRoute>

}
/>

<Route
  path="/tracker"
  element={
    <ProtectedRoute>
      <Tracker />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics/>
    </ProtectedRoute>
  }
/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
