import StatusBadge from "./StatusBadge.jsx";

const STATUS_OPTIONS = ["new", "contacted", "converted"];

export default function LeadTable({
  leads,
  loading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onStatusUpdate,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="card overflow-hidden">
      {/* Toolbar: search box + status filter live above the table itself */}
      <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="text"
          className="input sm:max-w-xs"
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="input sm:max-w-[160px]"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/50 border-b border-line">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Assigned to</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/50">
                  Loading leads…
                </td>
              </tr>
            )}

            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/50">
                  No leads match yet. Try a different search, or add your first lead.
                </td>
              </tr>
            )}

            {!loading &&
              leads.map((lead) => (
                <tr key={lead._id} className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                  <td className="px-4 py-3 text-ink/70">{lead.email}</td>
                  <td className="px-4 py-3 text-ink/70">{lead.phone}</td>
                  <td className="px-4 py-3 text-ink/70">{lead.assignedTo || "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={lead.status} />
                      <select
                        className="text-xs border border-line rounded px-1.5 py-1 bg-white"
                        value={lead.status}
                        onChange={(e) => onStatusUpdate(lead._id, e.target.value)}
                        aria-label={`Update status for ${lead.name}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="text-xs text-clay hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-line text-sm">
        <span className="text-ink/50">
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            className="btn-ghost px-3 py-1"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <button
            className="btn-ghost px-3 py-1"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
