

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from '../LandingPage'
import LoginPage from '../LoginPage'
import RegisterLoginPage from '../RegisterLoginPage'
import RegisterPage from '../RegisterPage'
const AnimatedRoutes = () => {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<RegisterLoginPage />}>
            <Route index path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default AnimatedRoutes
