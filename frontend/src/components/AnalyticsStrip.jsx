// Icon components
function TotalIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function NewIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

function ContactedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ConvertedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

const items = [
  { key: "total", label: "Total leads", color: "text-ink", bgColor: "bg-ink/5", icon: TotalIcon },
  { key: "new", label: "New", color: "text-amber", bgColor: "bg-amber/5", icon: NewIcon },
  { key: "contacted", label: "Contacted", color: "text-sky", bgColor: "bg-sky/5", icon: ContactedIcon },
  { key: "converted", label: "Converted", color: "text-moss", bgColor: "bg-moss/5", icon: ConvertedIcon },
];

export default function AnalyticsStrip({ data }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className={`card p-4 ${item.bgColor} border-l-4 border-l-${item.color.split('-')[1]}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-ink/60 font-medium">{item.label}</p>
                <p className={`font-display text-3xl mt-2 ${item.color}`}>
                  {data ? data[item.key] : "—"}
                </p>
              </div>
              <div className={`${item.color} opacity-20`}>
                <Icon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
