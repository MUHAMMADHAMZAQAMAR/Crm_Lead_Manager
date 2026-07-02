const styles = {
  new: "bg-amber/10 text-amber border-amber/30",
  contacted: "bg-sky/10 text-sky border-sky/30",
  converted: "bg-moss/10 text-moss border-moss/30",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
