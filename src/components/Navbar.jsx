import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar({ user, authLoading, authError, login, logout }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const ok = await login({ email, password });

    setSubmitting(false);

    if (ok) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <nav>
      <div className="flex justify-between px-10 items-center w-full bg-teal-500 h-14 border-b-2 border-black gap-x-6 text-2xl text-white ">
        <ul className="flex items-center gap-x-6">
          <li>
            <Link to="/" className="hover:text-yellow-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/owner" className="hover:text-yellow-500">
              Owner
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-x-3">
          {authLoading ? (
            <span className="text-base">Checking auth session...</span>
          ) : user ? (
            <>
              <span className="text-base">
                Logged in as <span>{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-x-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
                type="email"
                className="bg-white text-black px-2 rounded border text-base w-44"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                type="password"
                minLength={8}
                className="bg-white text-black px-2 rounded border text-base w-32"
              />
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-3 py-1 rounded-xl text-base"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </div>
      {authError ? <div>{authError}</div> : null}
    </nav>
  );
}
