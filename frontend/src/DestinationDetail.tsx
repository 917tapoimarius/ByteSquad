import React, { useState, useEffect } from 'react';
import TipsAndTricksList from './TipsAndTricks';
import './DestinationDetail.css';
import { useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import VoteChart from "./VoteChart";
import {Alert, Button, FormControl, InputLabel, MenuItem, Select, Snackbar} from "@mui/material";

interface Destination {
    destinationId: number;
    destinationCountry: string;
    destinationCity: string;
    destinationName: string;
    description: string;
}

const DestinationDetail: React.FC = () => {
    const { destinationId } = useParams<{ destinationId: string }>();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>('')
    const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [successSnackBar, setSuccessSnackBar] = React.useState(false);
    const [notSelectedSnackBar, setNotSelectedSnackBar] = React.useState(false);
    const [errorSnackBar, setErrorSnackBar] = React.useState(false);
    const [keyForRefresh, setKeyForRefresh] = useState(0); // New state for the key

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:8080/api/v1/destination/${destinationId}?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: Destination = await response.json();
                    setDestination(data);
                } else {
                    console.error('Error fetching destination details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching destination details:', error);
            }
        };

        fetchDestinationDetails();
    }, [destinationId]);

    const handleVote = async () => {
        if (selectedMonth && destination) {
            try {
                //console.log("month: " + selectedMonth);
                //console.log("destinationID: " + destinationId);
                const userId = localStorage.getItem('userId');
                const response = await fetch (`http://localhost:8080/api/v1/destination/voteDestination/${userId}/${destinationId}/${monthList.indexOf(selectedMonth) + 1}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setSuccessSnackBar(true);
                    setKeyForRefresh((prevKey) => prevKey + 1);
                    return;
                }
                else {
                    setErrorSnackBar(true);
                    return;
                }
            }
            catch (error) {
                console.log("Error voting for destination: ", error);
            }
        }
        else {
            setNotSelectedSnackBar(true);
            return;//?
        }
    }

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway')
            return;
        if (errorSnackBar == true)
            setErrorSnackBar(false);
        if (notSelectedSnackBar == true)
            setNotSelectedSnackBar(false);
        if (successSnackBar == true)
            setSuccessSnackBar(false);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        setErrorSnackBar(false);
        setNotSelectedSnackBar(false);
        setSuccessSnackBar(false);
    };

    function DropdownItem(props) {
        return (
            <FormControl fullWidth>
                <InputLabel required id="dropdown-item">{props.name}</InputLabel>
                <Select
                    labelId="dropdown-item-label"
                    id="dropdown-item"
                    value={props.selectedValue}
                    label={props.name}
                    onChange={props.handleChange}
                    style={{ fontFamily: 'Palatino'}}
                    sx={{backgroundColor: '#fffffc'}}
                >
                    {props.options &&
                        props.options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}

                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        )
    }

    if (!destination) {
        return <p>Loading...</p>;
    }

    if (!destination) {
        return <p>Loading...</p>;
    }

    return (
        <div className="details-page">
            <Navbar title="TravelTracker" />
            <div className="app-container">
                <div className="left-panel">
                    <div className="left-panel-content">
                        <h2>{destination.destinationName}</h2>
                        <p>{`City: ${destination.destinationCity}, Country: ${destination.destinationCountry}`}</p>
                        <p>Description: {destination.description}</p>
                        <div className="vote-destination-section">
                            <h3>Tell us when you have visited this destination!</h3>
                            <div className="vote-destination-widgets">
                                <DropdownItem className="dropdown-month" name="Month" options={monthList} selectedValue={selectedMonth}
                                              handleChange={handleMonthChange}/>
                                <Button className="vote-button" variant="contained" onClick={handleVote}
                                        style={{backgroundColor: '#f0b17a',
                                            fontFamily: 'Palatino',
                                            textTransform: 'capitalize'}}>Vote
                                </Button>
                            </div>
                        </div>
                        <Snackbar open={notSelectedSnackBar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                                Please select a month before voting!
                            </Alert>
                        </Snackbar>
                        <Snackbar open={successSnackBar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                                Successfully voted!
                            </Alert>
                        </Snackbar>
                        <Snackbar open={errorSnackBar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                                You already voted this month!
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="right-panel-content">
                        <div className="tips-header">
                            <img src="/img/2779262.png" alt="Tips and Tricks" className="tips-image" />
                            <h2>Tips and Tricks</h2>
                        </div>
                        <TipsAndTricksList destinationId={destination.destinationId} />
                    </div>
                </div>
            </div>
            <div className="most-visited-section">
                <h2>View when this place is most visited</h2>
                <VoteChart destinationId={destination.destinationId} keyForRefresh={keyForRefresh} />
                {/* Add your content for the "View when this place is most visited" section */}
            </div>

        </div>
    );
};

export default DestinationDetail;
