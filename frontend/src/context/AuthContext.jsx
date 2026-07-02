import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize state straight from localStorage, so refreshing the page
  // doesn't log the user out - the token and user info survive a reload.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(userData) {
    // userData comes back from the backend as { _id, name, email, token }
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    login(data); // registering logs you straight in, same as the backend intends
  }

  async function loginWithCredentials(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    login(data);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loginWithCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// A small custom hook so components write `const { user } = useAuth()`
// instead of `useContext(AuthContext)` everywhere - just a readability nicety.
export function useAuth() {
  return useContext(AuthContext);
}
