import { useState } from "react";

export default function AddLeadForm({ open, onClose, onCreate }) {
  const emptyForm = { name: "", email: "", phone: "", assignedTo: "" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onCreate(form);
      setForm(emptyForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add this lead. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-paper border-l border-line p-6 overflow-y-auto animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Add a lead</h2>
          <button
            onClick={onClose}
            className="text-ink/50 hover:text-ink text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-clay bg-clay/10 border border-clay/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Full name</label>
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              placeholder="Alex Rivera"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              placeholder="alex@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Phone</label>
            <input
              name="phone"
              className="input"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">
              Assigned to <span className="text-ink/40">(optional)</span>
            </label>
            <input
              name="assignedTo"
              className="input"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Team member's name"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Adding…" : "Add lead"}
            </button>
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
