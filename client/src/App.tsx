import { createTheme, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './app/pages/LandingPage'
import LoginPage from './app/pages/LoginPage'
import RegisterPage from './app/pages/RegisterPage'
import { responsiveFontSizes } from '@mui/material/styles'
import RegisterLoginPage from './app/pages/RegisterLoginPage'
import ProtectedRoute from './app/components/ProtectedRoute'
import Dashboard from './app/pages/Dashboard'
import CheckUserRoute from './app/components/CheckUserRoute'
import TeamsPage from './app/pages/TeamsPage'
import SearchPage from './app/pages/SearchPage'
import PostsPage from './app/pages/PostsPage'
import AboutDeveloperPage from './app/pages/AboutDeveloperPage'
import ChatSection from './app/pages/ChatSection'
import ChatIdProtectedRoute from './app/components/ChatIdProtectedRoute'
import {SocketProvider} from './app/store/SocketContext'
let theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#685369',
  //     // dark: '#ff206e',
  //   },
  //   secondary: {
  //     main: '#685369',
  //   },
  // },
})

theme = responsiveFontSizes(theme)
function App() {
  return (
    <SocketProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/home"
              element={
                <CheckUserRoute>
                  <LandingPage />
                </CheckUserRoute>
              }
            />
            <Route
              path="/"
              element={
                <CheckUserRoute>
                  <LandingPage />
                </CheckUserRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <CheckUserRoute>
                  <RegisterLoginPage />
                </CheckUserRoute>
              }
            >
              <Route index path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>}>
                <Route path=":chatId" element={<ChatIdProtectedRoute><ChatSection /></ChatIdProtectedRoute>} />
              </Route>

              <Route path="search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
              <Route path="aboutDev" element={<ProtectedRoute><AboutDeveloperPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </SocketProvider>
  )
}

export default App
