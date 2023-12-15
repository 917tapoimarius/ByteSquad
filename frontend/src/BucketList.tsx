import React, {useState, useEffect} from 'react';

interface Destination {
  destinationCountry: string;
  destinationCity: string;
  public: boolean;
  description: string;
  destinationName: string;
}

const BucketList: React.FC = () => {
  const [bucketList, setBucketList] = useState<Destination[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDestination, setNewDestination] = useState<Destination>({
    destinationCountry: '',
    destinationCity: '',
    public: false,
    description: '',
    destinationName: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterAttribute, setFilterAttribute] = useState<string>('DestinationName');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; // Replace with the appropriate user ID

        const response = await fetch(`http://localhost:8080/api/v1/destination/destinationsInBucketList/${userId}?pageNumber=0&pageSize=100&filteringAttribute=${filterAttribute}&filterInputData=${searchTerm}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBucketList(data);
        } else {
          console.error('Error fetching bucket list:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching bucket list:', error);
      }
    };

    fetchData();
  }, [searchTerm, filterAttribute]);

    const handleAddDestination = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/destination/add/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDestination),
            });

            if (response.ok) {
                // Add the new destination to the bucket list
                setBucketList(prevList => [...prevList, newDestination]);
                setShowAddModal(false);
                // Clear the form after adding a destination
                setNewDestination({

                    destinationCountry: '',
                    destinationCity: '',
                    public: false,
                    description: '',
                    destinationName: '',
                });
            } else {
                console.error('Error adding destination:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding destination:', error);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const userId = 1; // change this when we move from localhost

        // Define an inner async function
        const notifyBackend = async () => {
            // Get the data being dragged
            const draggedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

            // Check if the item already exists in the bucket list
            const isItemAlreadyInBucket = bucketList.some(
                (item) =>
                    item.destinationName === draggedItem.destinationName &&
                    item.destinationCountry === draggedItem.destinationCountry &&
                    item.destinationCity === draggedItem.destinationCity
            );

            // If the item is not already in the bucket list, add it
            if (!isItemAlreadyInBucket) {
                try {
                    // Notify the backend about the drag-and-drop event
                    const response = await fetch(`http://localhost:8080/api/v1/destination/dragDrop/${userId}/${draggedItem.destinationId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 400) {
                            alert('This item is already in your Bucket List!');
                        } else {
                            console.error('Error notifying backend:', response.statusText);
                        }
                    }
                    else{
                        // Add the dragged item to the bucket list
                        setBucketList((prevList) => [...prevList, draggedItem]);
                    }
                } catch (error) {
                    // Handle the error (e.g., show an error notification)
                    console.error('Error notifying backend:', error);
                }
            } else {
                // Notify the user about the duplicate item
                alert('This item is already in your Bucket List!');
                // You can also display a more user-friendly message in your UI
                // or use a modal to provide a better user experience.
            }
        };

        // Call the inner async function
        notifyBackend();
    };
      
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAttribute(event.target.value);
  };

    return (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <h2 className='titleOfList'>Bucket List</h2>
            <div className="list-container">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select value={filterAttribute} onChange={handleFilterChange}>
            <option value="DestinationName">Name</option>
            <option value="DestinationCity">City</option>
            <option value="DestinationCountry">Country</option>
          </select>
        </div>
                {bucketList.length === 0 ? (
                    <p>Empty Bucket List</p>
                ) : (
                    <ul>
                        {bucketList.map((destination, index) => (
                            <li key={index}>
                                <strong style={{ fontSize: '1.2em', fontStyle: 'oblique' }}>{destination.destinationName}</strong><br />
                {destination.destinationCity}, {destination.destinationCountry}<br />
                <i style={{ fontSize: '0.8em' }}>
                  {destination.description.length > 50 ? `${destination.description.slice(0, 50)}...` : destination.description}
                </i>
                <li></li>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className="addButton" onClick={() => setShowAddModal(true)}>
                +
            </button>

            {showAddModal && (
                <>
                    <div className="overlay"/>
                    <div className="modal">
                        <h4 className='Addtitle'>Add destination</h4>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newDestination.destinationName}
                                onChange={e => setNewDestination({...newDestination, destinationName: e.target.value})}
                            />
                        </label>
                        <label>
                            Country:
                            <input
                                type="text"
                                value={newDestination.destinationCountry}
                                onChange={e => setNewDestination({
                                    ...newDestination,
                                    destinationCountry: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            City:
                            <input
                                type="text"
                                value={newDestination.destinationCity}
                                onChange={e => setNewDestination({...newDestination, destinationCity: e.target.value})}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newDestination.description}
                                onChange={e => setNewDestination({...newDestination, description: e.target.value})}
                            />
                        </label>
                        <button onClick={handleAddDestination}>Add Destination</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BucketList;
