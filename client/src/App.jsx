import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import PainterDashboard from './pages/PainterDashboard'
import ClientDashboard from './pages/ClientDashboard'

function RequirePainter({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.isPainter) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireClient({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.isPainter) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/painter"
            element={
              <RequirePainter>
                <PainterDashboard />
              </RequirePainter>
            }
          />
          <Route
            path="/client"
            element={
              <RequireClient>
                <ClientDashboard />
              </RequireClient>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App 