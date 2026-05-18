import { useState, useContext } from "react";
import TravelCard from "./TravelCard";
import { UserContext } from "../../context/UserContext";

function TravelList({ travels, past }) {
  const { user } = useContext(UserContext);
  const [openedCards, setOpenedCards] = useState([]);

  const toggleCard = (id) => {
    setOpenedCards((prev) =>
      prev.includes(id)
        ? prev.filter((cardId) => cardId !== id)
        : [...prev, id]
    );
  };

  const getStatus = (travel) => {
    const isPassenger =
      travel.owner.id === user.id ||
      travel.passengers.some(
        (passenger) => passenger.id === user.id
      );

    if (isPassenger) {
      return "passenger";
    }

    const remainingSeats =
      travel.car.seats - travel.passengers.length - 1;

    if (remainingSeats > 0) {
      return "available";
    }

    return "full";
  };

  return (
    <div className="p-2 space-y-3">
      {[...travels]
        .sort((a, b) => {
          const diff = new Date(a.date + "T00:00:00Z") - new Date(b.date + "T00:00:00Z");
          return past ? -diff : diff;
        })
        .map((travel) => (
          <TravelCard
            key={travel.id}
            travel={travel}
            detailed={openedCards.includes(travel.id)}
            past={past}
            onClick={() => toggleCard(travel.id)}
            status={getStatus(travel)}
          />
        ))
      }
    </div>
  );
}

export default TravelList;