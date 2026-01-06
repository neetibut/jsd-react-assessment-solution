import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export function Layout() {
  const apiBase = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);

      try {
        const response = await axios.get(`${apiBase}/auth/cookie/me`, {
          withCredentials: true,
        });

        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [apiBase]);

  const login = async ({ email, password }) => {
    setAuthError(null);

    try {
      const response = await axios.post(
        `${apiBase}/auth/cookie/login`,
        { email, password },
        { withCredentials: true }
      );

      setUser(response.data.user);
      return true;
    } catch (error) {
      const message =
        error.response.data.message ||
        error.response.data.error ||
        error.message;

      setAuthError(message || "Login failed");
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await axios.post(
        `${apiBase}/auth/cookie/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
    }
  };

  return (
    <div>
      <Navbar
        user={user}
        authLoading={authLoading}
        authError={authError}
        login={login}
        logout={logout}
      />
      <section className="bg-amber-200 flex justify-center">
        <Outlet context={{ user, authLoading, apiBase }} />
      </section>
    </div>
  );
}
