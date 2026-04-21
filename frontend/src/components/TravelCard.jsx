function TravelCard({ travel, detailed, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-4 active:scale-[0.98] transition cursor-pointer"
    >
      <div className="font-semibold text-4xl">
        {travel.name}
      </div>

      <div className="text-sm text-gray-500 mt-1">
        {travel.start_location_name} → {travel.end_location_name}
      </div>

      {detailed && (
        <div className="mt-4 space-y-2 text-sm">
          
          <div>
            🚗 {travel.vehicle.name} ({travel.vehicle.seats} places)
          </div>

          <div>
            <ul className="">
              <li>{travel.owner.username}</li>
              {travel.passengers.map((p) => (
                <li key={p.id}>{p.username}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

export default TravelCard;