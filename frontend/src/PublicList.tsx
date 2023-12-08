import React, { useEffect, useState } from 'react';

interface Destination {
  destinationName: string;
  destinationCountry: string;
  destinationCity: string;
  public: boolean;
  description: string;
}

const PublicList: React.FC = () => {
  const [publicList, setPublicList] = useState<Destination[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/destination/allDestinations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((data: Destination[]) => setPublicList(data))
      .catch(error => console.error('Error fetching public list:', error));
  }, []);

  return (
    <div >
      <h2 className='titleOfList'>Public List</h2>
      <div className="list-container">
      {publicList.length === 0 ? (
        <p>Empty Public List </p>
      ) : (
        <ul>
          {publicList.map((destination, index) => (
              <li
                  key={index}
                  draggable   // Make each list item draggable
                  onDragStart={(e) => {
                    // Set the data being dragged
                    e.dataTransfer.setData('text/plain', JSON.stringify(destination));
                  }}
              >
              {destination.destinationCountry}, {destination.destinationCity}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default PublicList;
