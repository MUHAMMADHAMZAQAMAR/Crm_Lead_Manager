import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import AnalyticsStrip from "../components/AnalyticsStrip.jsx";
import AnalyticsCharts from "../components/AnalyticsCharts.jsx";
import LeadTable from "../components/LeadTable.jsx";
import AddLeadForm from "../components/AddLeadForm.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", {
        params: { page, limit: 8, status: statusFilter, search },
      });
      setLeads(data.leads);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await api.get("/leads/analytics");
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  async function handleCreateLead(form) {
    await api.post("/leads", form);
    await Promise.all([fetchLeads(), fetchAnalytics()]);
  }

  async function handleStatusUpdate(id, status) {
    // Optimistic-ish update: we still wait for the API, but we do it
    // right where the click happened rather than routing through props
    // and back, keeping the flow easy to follow.
    await api.patch(`/leads/${id}/status`, { status });
    await Promise.all([fetchLeads(), fetchAnalytics()]);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this lead? This can't be undone.")) return;
    await api.delete(`/leads/${id}`);
    await Promise.all([fetchLeads(), fetchAnalytics()]);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">Ledger</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/60 hidden sm:inline">{user?.name}</span>
            <button onClick={logout} className="text-sm text-ink/60 hover:text-ink">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-ink">Leads</h2>
            <p className="text-sm text-ink/60">Track and move every lead through your pipeline.</p>
          </div>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            + Add lead
          </button>
        </div>

        <AnalyticsStrip data={analytics} />

        <AnalyticsCharts data={analytics} />

        <LeadTable
          leads={leads}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <AddLeadForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreate={handleCreateLead}
      />
    </div>
  );
}
