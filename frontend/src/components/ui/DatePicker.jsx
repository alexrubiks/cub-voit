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
    {
      key: "same",
      label: "Jour J",
      date: selectedCompetition?.date ?? null,
    },
    {
      key: "before",
      label: "Veille",
      date: selectedCompetition ? getBeforeDate(selectedCompetition.date) : null,
    },
    {
      key: "custom",
      label: "custom",
    },
  ];

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
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
              className={`flex-1 aspect-square flex flex-col items-center justify-center rounded-xl border transition ${
                active
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white border-gray-200 hover:border-indigo-300"
              }`}
            >
              {key === "custom" ? (
                <>
                  <Calendar size={26} className={active ? "text-white" : "text-gray-400"} />
                  <span className={`text-sm mt-1 ${active ? "text-white" : "text-gray-400"}`}>
                    Choisir
                  </span>
                </>
              ) : day ? (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <span className={`absolute top-2 text-[10px] uppercase tracking-widest ${active ? "text-white/60" : "text-gray-300"}`}>
                    {label}
                  </span>
                  <span className={`text-3xl font-bold leading-none ${active ? "text-white" : "text-indigo-600"}`}>
                    {day}
                  </span>
                  <span className={`text-sm mt-0.5 lowercase ${active ? "text-white/80" : "text-gray-400"}`}>
                    {month}
                  </span>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  <span className={`absolute top-2 text-[10px] uppercase tracking-widest ${active ? "text-white/60" : "text-gray-300"}`}>
                    {label}
                  </span>
                  <span className={`text-3xl font-bold leading-none ${active ? "text-white" : "text-gray-300"}`}>
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
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
        />
      )}
    </div>
  );
}

export default DatePicker;