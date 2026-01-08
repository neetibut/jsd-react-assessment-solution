import { useEffect, useState } from "react";
import { UserTable } from "../components/UserTable";
import { AdminTable } from "../components/AdminTable";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { user, authLoading, apiBase } = useOutletContext();
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);

  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState(null);
  const [askResult, setAskResult] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiBase);
      setUsers(res.data.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const askAi = async (e) => {
    e.preventDefault();
    const q = String(question || "").trim();

    if (!q) return;

    setAskLoading(true);
    setAskError(null);
    setAskResult(null);

    try {
      const response = await axios.post(
        `${apiBase}/auth/ai/ask`,
        { question: q, topK: 5 },
        { withCredentials: true }
      );
      setAskResult(response.data?.data || null);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message;
      setAskError(message || "Failed to ask AI");
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 gap-y-6 flex flex-col justify-start w-full">
      <section className="mt-20 text-5xl font-extrabold text-center">
        <h1>Generation Thailand</h1>
        <h1>React Assessment</h1>
      </section>
      <section className="flex justify-center gap-x-3 font-bold">
        <button
          onClick={() => setView("user")}
          className=" p-5 bg-sky-200 flex rounded-2xl cursor-pointer border hover:bg-sky-300"
        >
          User Section
        </button>
        <button
          onClick={() => setView("admin")}
          className=" p-5 bg-rose-100 flex rounded-2xl cursor-pointer border hover:bg-rose-200"
        >
          Admin Section
        </button>
      </section>
      <section className="w-full flex justify-center">
        <div className="w-full max-w-3xl bg-white border rounded-2xl p-5">
          <div className="font-bold text-lg">Ask AI about users</div>
          {authLoading ? (
            <div className="text-sm mt-2">Checking login…</div>
          ) : user ? (
            <form onSubmit={askAi} className="mt-3 flex gap-x-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='e.g. "Who are the admins?"'
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={askLoading}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-4 py-2 rounded"
              >
                {askLoading ? "Asking…" : "Ask"}
              </button>
            </form>
          ) : (
            <div className="text-sm mt-2 font-bold">
              Please log in to use the AI feature
            </div>
          )}

          {askError ? (
            <div className="mt-3 text-sm bg-rose-100 border border-rose-200 text-rose-900 p-3 rounded">
              {askError}
            </div>
          ) : null}

          {askResult ? (
            <div className="mt-3 text-sm">
              <div className="font-bold">Answer</div>
              <div className="mt-1 whitespace-pre-wrap">
                {askResult.answer || "(no answer)"}
              </div>

              <div className="font-bold mt-3">Sources</div>
              {Array.isArray(askResult.sources) && askResult.sources.length ? (
                <ul className="list-disc pl-6 mt-1">
                  {askResult.sources.map((s) => (
                    <li key={s._id}>
                      {s.username} ({s.role}) — {s.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-1">No sources found.</div>
              )}
            </div>
          ) : null}
        </div>
      </section>
      <section className="w-full flex justify-center gap-x-3">
        {view === "user" ? (
          <section className=" p-5  flex">
            <UserTable users={users} />
          </section>
        ) : view === "admin" ? (
          <section className=" p-5  flex">
            {authLoading ? (
              <div>Checking user auth...</div>
            ) : user ? (
              <AdminTable
                users={users}
                setUsers={setUsers}
                fetchUsers={fetchUsers}
                API={apiBase}
              />
            ) : (
              <div>Please login to access Admin Section</div>
            )}
          </section>
        ) : null}
      </section>
    </div>
  );
}
