import { useState } from "react";
import { Calendar } from "lucide-react";

function DatePicker({ selectedCompetition, onChange }) {
  const [dateMode, setDateMode] = useState(null);

  const getBeforeDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const handleDateMode = (mode) => {
    setDateMode(mode);
    if (!selectedCompetition) return;
    if (mode === "same") {
      onChange(selectedCompetition.date);
    } else if (mode === "before") {
      onChange(getBeforeDate(selectedCompetition.date));
    } else {
      onChange("");
    }
  };

  const buttons = [
    { key: "same",   label: "Jour J", date: selectedCompetition?.date ?? null },
    { key: "before", label: "Veille", date: selectedCompetition ? getBeforeDate(selectedCompetition.date) : null },
    { key: "custom", label: "custom" },
  ];

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
        Date de départ
      </label>
      <div className="flex gap-2 mb-2">
        {buttons.map(({ key, label, date }) => {
          const active = dateMode === key;
          const day = date ? new Date(date + "T00:00:00Z").getUTCDate() : null;
          const month = date
            ? new Date(date + "T00:00:00Z").toLocaleString("fr-FR", { month: "short" })
            : null;

          return (
            <button
              key={key}
              onClick={() => handleDateMode(key)}
              className={`flex-1 aspect-square flex flex-col items-center justify-center rounded-lg border transition ${
                active
                  ? "bg-primary border-primary"
                  : "bg-bg-surface border-border hover:border-border-strong"
              }`}
            >
              {key === "custom" ? (
                <>
                  <Calendar size={26} className={active ? "text-primary-text" : "text-text-muted"} />
                  <span className={`text-sm mt-1 ${active ? "text-primary-text" : "text-text-muted"}`}>
                    Choisir
                  </span>
                </>
              ) : day ? (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <span className={`absolute top-2 text-[10px] uppercase tracking-widest ${active ? "text-primary-text/60" : "text-text-muted"}`}>
                    {label}
                  </span>
                  <span className={`text-3xl font-bold leading-none ${active ? "text-primary-text" : "text-primary"}`}>
                    {day}
                  </span>
                  <span className={`text-sm mt-0.5 lowercase ${active ? "text-primary-text/80" : "text-text-muted"}`}>
                    {month}
                  </span>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <span className={`absolute top-2 text-[10px] uppercase tracking-widest ${active ? "text-primary-text/60" : "text-text-muted"}`}>
                    {label}
                  </span>
                  <span className={`text-3xl font-bold leading-none ${active ? "text-primary-text" : "text-text-muted"}`}>
                    —
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {dateMode === "custom" && (
        <input
          type="date"
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary bg-bg-surface"
        />
      )}
    </div>
  );
}

export default DatePicker;