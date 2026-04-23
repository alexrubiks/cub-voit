import PersonCard from "./PersonCard";
import { FaCarSide } from "react-icons/fa";

function TravelCard({ travel, detailed, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-4 active:scale-[0.98] transition cursor-pointer"
    >
      
      <div className="flex justify-between items-start gap-3">
        
        {/* LEFT : title + route */}
        <div className="flex-1 min-w-0">
          
          <div className="font-semibold text-4xl text-black">
            {travel.name}
          </div>

          <div className="text-2xl text-gray-500 mt-1">
            {travel.start_location_name} → {travel.end_location_name}
          </div>

        </div>

        {/* RIGHT : date block */}
        <div className="flex flex-col items-center justify-center w-14 shrink-0">
  
          {travel.date ? (
            <>
              <span className="text-4xl text-black font-bold">
                {new Date(travel.date).getDate()}
              </span>

              <span className="text-xl text-black lowercase">
                {new Date(travel.date).toLocaleString("fr-FR", {
                  month: "short",
                })}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400">
              —
            </span>
          )}

        </div>

      </div>

      {detailed && (
        <div className="mt-4 space-y-2 text-xl">
          
          <div className="flex items-center gap-3">
  
            {/* icône */}
            <FaCarSide className="w-10 h-10 text-black"/>

            {/* texte */}
            <div className="flex flex-col leading-tight">
              
              <span className="text-base text-left italic font-semibold">
                {travel.vehicle.name}
              </span>

              <span className="text-sm text-left text-gray-500 -mt-1">
                {travel.vehicle.seats} places
              </span>

            </div>

          </div>

          <div className="mt-3 space-y-2">
  
            {/* conducteur */}
            <PersonCard
              user={travel.owner}
              role="driver"
            />

            {/* passagers */}
            {travel.passengers.map((p) => (
              <PersonCard
                key={p.id}
                user={p}
                role="passenger"
              />
            ))}

          </div>

        </div>
      )}
    </div>
  );
}

export default TravelCard;