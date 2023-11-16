import React, { useState } from 'react';
import './Chat.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

const Chat: React.FC = () => {
    //for dropdowns
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');

    const [additionalInfoTextBox, setAdditionalInfoTextBox] = useState('');
    const [chatResponseTextBox, setChatResponseTextBox] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // dropdowns lists
    const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const seasonList = ['Yes', 'No', 'Does not matter'];

    // you need to populate those 2 from backend
    const continentList =[];
    const countryList = [];

    // checkboxes
    const [stateCheckbox, setStateCheckbox] = React.useState({
        mountain: false,
        beach: false,
        countrySide: false,
        urban: false,
        tropical: false,
        historical: false,
    });
    const {mountain, beach, countrySide, urban, tropical, historical} = stateCheckbox;


    const handleGenerateButtonClick = () => {
        // the additional info button
    };

    const handleAddButtonClick = () => {
        // the chatGpt response button
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value);
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleChangeCheckbox = (event) => {
        setStateCheckbox({
            ...stateCheckbox,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <div className="main-layout">
            <div className="title">
                <p>Talk with the TravelBot</p>
                <div className="description">
                    <p><em>Hello, I'm at your disposal to provide you the best destinations! Tell me what you would
                        like..</em></p>
                </div>
            </div>
            <div className="component-container">
                <div className="dropdowns-checkboxes">
                    <div className="dropdowns">
                        <div className="dropdown-left">
                            <DropdownItem name="Continent" options={continentList} selectedValue={selectedContinent}
                                          handleChange={handleContinentChange}/>
                            <DropdownItem name="Month" options={monthsList} selectedValue={selectedMonth}
                                          handleChange={handleMonthChange}/>
                        </div>
                        <div className="dropdown-right">
                            <DropdownItem name="Country" options={countryList} selectedValue={selectedCountry}
                                          handleChange={handleCountryChange}/>
                            <DropdownItem name="Season" options={seasonList} selectedValue={selectedSeason}
                                          handleChange={handleSeasonChange}/>
                        </div>
                    </div>
                    <div className="checkboxes">
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={mountain}
                                                                 onChange={handleChangeCheckbox}
                                                                 name="mountain" style={{color:"#f0b17a"}}/>}
                                              label={<Typography variant="body1"
                                                                 style={{ fontFamily: 'Palatino'}}>Mountain</Typography>}
                            />
                            <FormControlLabel control={<Checkbox checked={countrySide}
                                                                 onChange={handleChangeCheckbox}
                                                                 name="countrySide" style={{color:"#f0b17a"}}/>}
                                              label={<Typography variant="body1"
                                                                 style={{ fontFamily: 'Palatino' }}>Countryside</Typography>}
                            />
                            <FormControlLabel control={<Checkbox checked={tropical}
                                                                 onChange={handleChangeCheckbox}
                                                                 name="tropical" style={{color:"#f0b17a"}}/>}
                                              label={<Typography variant="body1"
                                                                 style={{ fontFamily: 'Palatino' }}>Tropical</Typography>}
                            />
                        </FormGroup>
                        <div className="checkboxes-right">
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={beach}
                                                                     onChange={handleChangeCheckbox}
                                                                     name="beach" style={{color:"#f0b17a"}}/>}
                                                  label={<Typography variant="body1"
                                                                     style={{ fontFamily: 'Palatino' }}>Beach</Typography>}
                                />
                                <FormControlLabel control={<Checkbox checked={urban}
                                                                     onChange={handleChangeCheckbox}
                                                                     name="urban" style={{color:"#f0b17a"}}/>}
                                                  label={<Typography variant="body1"
                                                                     style={{ fontFamily: 'Palatino' }}>Urban</Typography>}
                                />
                                <FormControlLabel control={<Checkbox checked={historical}
                                                                     onChange={handleChangeCheckbox}
                                                                     name="historical" style={{color:"#f0b17a"}}/>}
                                                  label={<Typography variant="body1"
                                                                     style={{ fontFamily: 'Palatino' }}>Historical</Typography>}
                                />
                            </FormGroup>
                        </div>
                    </div>

                </div>
                <div className="text-boxes">
                    <label className="additional-info-label">Additional Info:</label>
                    <div className="additionalInfo-button-container">
                        <input className="additional-info" type="text" value={additionalInfoTextBox} onChange={(e) => setAdditionalInfoTextBox(e.target.value)}/>
                        <Button className="generate-button" variant="contained" onClick={handleGenerateButtonClick}
                                style={{backgroundColor: '#f0b17a',
                                    fontFamily: 'Palatino',
                                    textTransform: 'capitalize'}}>Generate
                        </Button>
                    </div>
                    {/*Here I tried to enable the add button only when there are changes in the chatResponseTextBox from the backend*/}
                    <div className="chatResponse-button-container">
                        <input disabled className="chatResponse" readOnly type="text" value={chatResponseTextBox}
                               onChange={(e) => {setChatResponseTextBox(e.target.value);
                                                    setHasChanges(true)}}/>
                        <Button className="add-button" variant="contained"
                                disabled={!hasChanges}
                                onClick={handleAddButtonClick}
                                style={{backgroundColor: '#f0b17a',
                                    fontFamily: 'Palatino',
                                    textTransform: 'capitalize',

                                }}>Add
                        </Button>
                    </div>

                </div>


            </div>
        </div>


    );
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


export default Chat;
