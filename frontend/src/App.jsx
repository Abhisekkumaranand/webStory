import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useAuth } from './auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

export function LogoutButton({ onClick }) {
  const { logout } = useAuth()
  const nav = useNavigate()
  return (
    <Button onClick={() => { logout(); nav('/'); onClick && onClick(); }} variant="outline" size="sm">Logout</Button>
  )
}



export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user?.role === 'admin' ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const authLinks = user ? [] : [
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              WebStories
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {authLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin/new">
                  <Button size="sm">Create Story</Button>
                </Link>
              )}
              {user && <LogoutButton onClick={() => setIsMobileMenuOpen(false)} />}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(link.to)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(link.to)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <Link to="/admin/new" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-fit">Create Story</Button>
                  </Link>
                )}
                {user && <LogoutButton />}
              </nav>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
