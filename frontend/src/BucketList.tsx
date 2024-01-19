import React, { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Destination {
    destinationId?: number;
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
        destinationId: -1,
        destinationCountry: '',
        destinationCity: '',
        public: false,
        description: '',
        destinationName: '',
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterAttribute, setFilterAttribute] = useState<string>('DestinationName');
    const pageSize = 4;
    const [totalPages, setTotalPages] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [countDestinations, setCountDestinations] = useState<number>(0);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
    const [addError, setAddError] = useState<boolean>(false);
    const [fillError, setfillError] = useState<boolean>(false);
    const [addErrorDuplicate, setAddErrorDuplicate] = useState<boolean>(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
    const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);
    const [editError, setEditError] = useState<boolean>(false);
    const userId = localStorage.getItem('userId');

    const fetchData = async () => {
        try {
            // the count of destinations
            const countResponse = await fetch(`http://localhost:8080/api/v1/destination/destinationsInBucketList/${userId}/count?filteringAttribute=${filterAttribute}&filterInputData=${searchTerm}`);
            const countData = await countResponse.json();
            const countDestinations = countData;
            setCountDestinations(countDestinations);
            const totalPages = Math.ceil(countDestinations / pageSize);
            setTotalPages(totalPages);

            // get destinations for the first page
            const dataResponse = await fetch(`http://localhost:8080/api/v1/destination/destinationsInBucketList/${userId}?pageNumber=${currentPage - 1}&pageSize=${pageSize}&filteringAttribute=${filterAttribute}&filterInputData=${searchTerm}`);
            const data = await dataResponse.json();
            setBucketList(data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
        //  setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, filterAttribute, searchTerm]);

    const [addSuccess, setAddSuccess] = useState<boolean>(false);
    const handleAddDestination = async () => {
        if (
            !newDestination.destinationName ||
            !newDestination.destinationCountry ||
            !newDestination.destinationCity ||
            !newDestination.description
        ) {
            setfillError(true);
            return;
        }
        const isDuplicate = bucketList.some(
            (item) =>
                item.destinationName.toLowerCase() === newDestination.destinationName.toLowerCase() &&
                item.destinationCity.toLowerCase() === newDestination.destinationCity.toLowerCase()
        );
        if (isDuplicate) {
            setAddErrorDuplicate(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/destination/add/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDestination),
            });

            if (response.ok) {
                const responseData = await response.json();
                setAddSuccess(true);
            
                setBucketList((prevList) => [...prevList, responseData]);
              
                console.log('New data from backend:', responseData);

                console.log('Updated bucketList:', bucketList);
                setShowAddModal(false);
                setNewDestination({
                    destinationCountry: '',
                    destinationCity: '',
                    public: false,
                    description: '',
                    destinationName: '',
                });

                setCountDestinations((prevCount) => prevCount + 1);
                const updatedTotalPages = Math.ceil((countDestinations + 1) / pageSize);
                setTotalPages(updatedTotalPages);

                setCurrentPage(updatedTotalPages);
            } else {
                console.error('Error adding destination:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding destination:', error);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {

        setCurrentPage(value);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const notifyBackend = async () => {
            const draggedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

            const isItemAlreadyInBucket = bucketList.some(
                (item) =>
                    item.destinationName === draggedItem.destinationName &&
                    item.destinationCountry === draggedItem.destinationCountry &&
                    item.destinationCity === draggedItem.destinationCity
            );

            if (!isItemAlreadyInBucket) {
                try {
                    const response = await fetch(`http://localhost:8080/api/v1/destination/dragDrop/${userId}/${draggedItem.destinationId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 400) {
                            setAddError(true);
                        } else {
                            console.error('Error notifying backend:', response.statusText);
                        }
                    } else {
                        const updatedData = await fetch(`http://localhost:8080/api/v1/destination/destinationsInBucketList/${userId}?pageNumber=${currentPage - 1}&pageSize=${pageSize}&filteringAttribute=${filterAttribute}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(response => response.json());

                        setBucketList(updatedData);
                        setAddSuccess(true);

                        setCountDestinations(prevCount => prevCount + 1);
                        const updatedTotalPages = Math.ceil((countDestinations + 1) / pageSize);
                        setTotalPages(updatedTotalPages);

                        setCurrentPage(updatedTotalPages);


                        console.log("adxsfdcasc: "+ currentPage);

                    }
                } catch (error) {
                    console.error('Error notifying backend:', error);
                }
            } else {
                setAddError(true);
            }
        };

        notifyBackend();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
        console.log("handleSearchChange: " + "currentPage" + currentPage + " totalPages: " + totalPages, + " count: " + countDestinations)

    };
    const handleItemClick = (destinationId: number) => {
    window.location.assign(`/detail/${destinationId}`);
  };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("handleFilterChange: " + "currentPage" + currentPage + " totalPages: " + totalPages, + " count: " + countDestinations)
        setFilterAttribute(event.target.value);
        setCurrentPage(1);
    };

    const openDeleteConfirmation = (destination: Destination) => {
        setDestinationToDelete(destination);
        setDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setDestinationToDelete(null);
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteDestination = async () => {
        closeDeleteConfirmation();

        if (destinationToDelete) {
            try {

                const response = await fetch(`http://localhost:8080/api/v1/destination/delete/${userId}/${destinationToDelete.destinationId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBucketList((prevList) => prevList.filter((item) => item.destinationId !== destinationToDelete.destinationId));
                    setCountDestinations((prevCount) => prevCount - 1);
                    const updatedTotalPages = Math.ceil((countDestinations - 1) / pageSize);
                    setTotalPages(updatedTotalPages);
                    setDeleteSuccess(true);

                    if(currentPage != totalPages){
                        fetchData();
                    }
                    else if (bucketList.length === 1) {
                        setCurrentPage((prevPage) => prevPage - 1);
                    }
                } else {
                    console.error('Error deleting destination:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting destination:', error);
            }
        }
    };

    const handleEditDestination = (destination: Destination) => {
        setEditingDestination(destination);
        setShowEditModal(true);
    };

    const closeEditForm = () => {
        setEditingDestination(null);
        setShowEditModal(false);
    };

    const handleSaveEdit = async () => {
        if (editingDestination) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/destination/update/${editingDestination.destinationId}?userId=${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingDestination),
                });

                if (response.ok) {
                    setBucketList((prevList) =>
                        prevList.map((item) => (item.destinationId === editingDestination.destinationId ? editingDestination : item))
                    );
                    setUpdateSuccess(true);
                    closeEditForm();
                } else {
                    setEditError(true);
                    console.error('Error updating destination:', response.statusText);
                }
            } catch (error) {
                setEditError(true);
                console.error('Error updating destination:', error);
            }
        }
    };

    const listItemStyle: React.CSSProperties = {
        position: 'relative',
    };

    const entityActionsStyle: React.CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        display: 'flex',
    };
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref
      ) {
        return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
      });
    return (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className='button-and-title'>
                <div className='button-div'>
                <Tooltip title="Add a destination" arrow>
                    <button className="addButton" onClick={() => setShowAddModal(true)}>
                         +
                    </button>
                </Tooltip>
                </div>
                <h2 className='titleOfList' style={{margin: '0 auto'}}>Bucket List</h2>


            </div>

            <div className="list-container" style={{ height: '450px', backgroundColor: '#f7f4ed', flex: 1}}>
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
                        <li key={destination.destinationId} style={listItemStyle} onClick={() => handleItemClick(destination.destinationId)}>
                            <div style={entityActionsStyle} className="entity-actions">
                                {destination.public ? (
                                    <>
                                        <DeleteIcon onClick={(e) => { e.stopPropagation(); openDeleteConfirmation(destination); }} className="delete-icon" />
                                        <Tooltip title="Edit is disabled for public destinations" arrow>
                                            <EditIcon className="edit-icon" style={{ cursor: 'not-allowed' }} onClick={(e) =>{e.stopPropagation()}} />
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <DeleteIcon onClick={(e) => { e.stopPropagation(); openDeleteConfirmation(destination); }} className="delete-icon" />
                                        <EditIcon onClick={(e) =>{e.stopPropagation(); handleEditDestination(destination)}} className="edit-icon" />
                                    </>
                                )}
                            </div>
                            <strong style={{ fontSize: '1.2em', fontStyle: 'oblique' }}>{destination.destinationName}</strong><br />
                            {destination.destinationCity}, {destination.destinationCountry}<br />
                            <i style={{ fontSize: '0.8em' }}>
                                {destination.description.length > 50 ? `${destination.description.slice(0, 50)}...` : destination.description}
                            </i>
                        </li>
                    ))}
                </ul>
                
                )}
            </div>
            <div className="pagination-container" align="center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                    size="large"
                    siblingCount={0}
                />
            </div>


            {showAddModal && (
                <>
                    <div className="overlay" />
                    <div className="modal">
                        <h4 className='Addtitle'>Add destination</h4>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newDestination.destinationName}
                                onChange={e => setNewDestination({ ...newDestination, destinationName: e.target.value })}
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
                                onChange={e => setNewDestination({ ...newDestination, destinationCity: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newDestination.description}
                                onChange={e => setNewDestination({ ...newDestination, description: e.target.value })}
                            />
                        </label>
                        <button onClick={handleAddDestination}>Add Destination</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </>
            )}
            {showEditModal && (
                <>
                    <div className="overlay" onClick={closeEditForm} />
                    <div className="modal">
                        <h4 className="EditTitle">Edit destination</h4>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editingDestination?.destinationName || ''}
                                onChange={(e) => setEditingDestination((prev) => ({ ...prev!, destinationName: e.target.value }))}
                            />
                        </label>
                        <label>
                            Country:
                            <input
                                type="text"
                                value={editingDestination?.destinationCountry || ''}
                                onChange={(e) => setEditingDestination((prev) => ({ ...prev!, destinationCountry: e.target.value }))}
                            />
                        </label>
                        <label>
                            City:
                            <input
                                type="text"
                                value={editingDestination?.destinationCity || ''}
                                onChange={(e) => setEditingDestination((prev) => ({ ...prev!, destinationCity: e.target.value }))}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={editingDestination?.description || ''}
                                onChange={(e) => setEditingDestination((prev) => ({ ...prev!, description: e.target.value }))}
                            />
                        </label>
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={closeEditForm}>Cancel</button>
                    </div>
            
                </>
            )}
             <Snackbar open={addSuccess} autoHideDuration={3000} onClose={() => setAddSuccess(false)}>
            <Alert onClose={() => setAddSuccess(false)} severity="success">
                The destination has been added successfully.
            </Alert>
        </Snackbar>
        <Snackbar open={updateSuccess} autoHideDuration={3000} onClose={() => setUpdateSuccess(false)}>
                <Alert onClose={() => setUpdateSuccess(false)} severity="success">
                    The destination has been updated successfully.
                </Alert>
            </Snackbar>
            <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
                <Alert onClose={() => setDeleteSuccess(false)} severity="success">
                    The destination has been deleted successfully.
                </Alert>
            </Snackbar>
            <Snackbar open={addError} autoHideDuration={3000} onClose={() => setAddError(false)}>
                <Alert onClose={() => setAddError(false)} severity="error">
                This item is already in your Bucket List!
                </Alert>
            </Snackbar>
            <Snackbar open={addErrorDuplicate} autoHideDuration={3000} onClose={() => setAddErrorDuplicate(false)}>
                <Alert onClose={() => setAddErrorDuplicate(false)} severity="error">
                Destination with the same name and city already exists in the Bucket List.
                </Alert>
                </Snackbar>
                <Snackbar open={fillError} autoHideDuration={3000} onClose={() => setfillError(false)}>
                <Alert onClose={() => setfillError(false)} severity="error">
                Please fill in all fields before adding the destination.
                </Alert>
                </Snackbar>  
                <Snackbar open={editError} autoHideDuration={3000} onClose={() => setEditError(false)}>
    <Alert onClose={() => setEditError(false)} severity="error">
        The destination is already in the Bucket List.
    </Alert>
</Snackbar>
                {destinationToDelete && (
                <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
                    <DialogTitle style={{ textAlign: 'center', fontFamily: "'Quicksand', sans-serif" }}>Delete Destination</DialogTitle>
                    <DialogContent>
                        <DialogContentText  style={{ fontFamily: "'Quicksand', sans-serif" }}>
                            Are you sure you want to delete the destination <strong>{destinationToDelete.destinationName}</strong>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteConfirmation} color="primary"  style={{ textAlign: 'center', fontFamily: "'Quicksand', sans-serif" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteDestination} color="primary" autoFocus  style={{ textAlign: 'center', fontFamily: "'Quicksand', sans-serif" }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
          
        </div>
    );
};

export default BucketList;