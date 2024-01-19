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
import axios from "axios";

const Chat: React.FC = () => {
    //for dropdowns
    const [selectedContinent, setSelectedContinent] = useState('Anywhere');
    const [selectedCountry, setSelectedCountry] = useState('Anywhere');
    const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const [additionalInfoTextBox, setAdditionalInfoTextBox] = useState('');
    const [chatResponseTextBox, setChatResponseTextBox] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // dropdowns lists
    const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const seasonList = ['Yes', 'No', 'Does not matter'];

    // you need to populate those 2 from backend
    const continentList =["Anywhere", "Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"];
    const countryList = [
        { continent: "Anywhere", countries: ["Anywhere"] },
        {continent: "Africa", countries:
                ["Anywhere",
                    "Algeria",
                    "Angola",
                    "Benin",
                    "Botswana",
                    "Burkina Faso",
                    "Burundi",
                    "Cameroon",
                    "Cabo Verde",
                    "Cameroon",
                    "Central African Republic",
                    "Chad",
                    "Comoros",
                    "Congo, Democratic Republic of the",
                    "Congo, Republic of the",
                    "Cote d'Ivoire",
                    "Djibouti",
                    "Egypt",
                    "Equatorial Guinea",
                    "Eritrea",
                    "Eswatini",
                    "Ethiopia",
                    "Gabon",
                    "Gambia",
                    "Ghana",
                    "Guinea",
                    "Guinea-Bissau",
                    "Kenya",
                    "Lesotho",
                    "Liberia",
                    "Libya",
                    "Madagascar",
                    "Malawi",
                    "Mali",
                    "Mauritania",
                    "Mauritius",
                    "Morocco",
                    "Mozambique",
                    "Namibia",
                    "Niger",
                    "Nigeria",
                    "Rwanda",
                    "Sao Tome and Principe",
                    "Senegal",
                    "Seychelles",
                    "Sierra Leone",
                    "Somalia",
                    "South Africa",
                    "South Sudan",
                    "Sudan",
                    "Tanzania",
                    "Togo",
                    "Tunisia",
                    "Uganda",
                    "Zambia",
                    "Zimbabwe"]},
        {continent: "Antarctica", countries:
                ["Anywhere",
                    "Bouvet Island",
                    "French Southern Territories",
                    "Heard Island and McDonald Islands",
                    "South Georgia and the South Sandwich Islands"]},
        {continent: "Asia", countries:
                ["Anywhere",
                    "Afghanistan",
                    "Armenia",
                    "Azerbaijan",
                    "Bahrain",
                    "Bangladesh",
                    "Bhutan",
                    "British Indian Ocean Territory (Chagos Archipelago)",
                    "Brunei Darussalam",
                    "Cambodia",
                    "China",
                    "Christmas Island",
                    "Cocos (Keeling) Islands",
                    "Cyprus",
                    "Georgia",
                    "Hong Kong",
                    "India",
                    "Indonesia",
                    "Iran",
                    "Iraq",
                    "Israel",
                    "Japan",
                    "Jordan",
                    "Kazakhstan",
                    "North Korea",
                    "South Korea",
                    "Kuwait",
                    "Kyrgyz Republic",
                    "Lao People's Democratic Republic",
                    "Lebanon",
                    "Macao",
                    "Malaysia",
                    "Maldives",
                    "Mongolia",
                    "Myanmar",
                    "Nepal",
                    "Oman",
                    "Pakistan",
                    "Philippines",
                    "Qatar",
                    "Saudi Arabia",
                    "Singapore",
                    "Sri Lanka",
                    "Syrian Arab Republic",
                    "Taiwan",
                    "Tajikistan",
                    "Thailand",
                    "Timor-Leste",
                    "Turkey",
                    "Turkmenistan",
                    "United Arab Emirates",
                    "Uzbekistan",
                    "Vietnam",
                    "Yemen"]},
        {continent: "Australia", countries:
                ["Anywhere",
                    "Australia",
                    "Fiji",
                    "Kiribati",
                    "Marshall Islands",
                    "Micronesia",
                    "Nauru",
                    "New Zealand",
                    "Palau",
                    "Papua New Guinea",
                    "Samoa",
                    "Solomon Islands",
                    "Tonga",
                    "Tuvalu",
                    "Vanuatu"]},
        { continent: "Europe", countries:
                ["Anywhere",
                    "Albania",
                    "Andorra",
                    "Armenia",
                    "Austria",
                    "Azerbaijan",
                    "Belarus",
                    "Belgium",
                    "Bosnia and Herzegovina",
                    "Bulgaria",
                    "Croatia",
                    "Cyprus",
                    "Czech Republic",
                    "Denmark",
                    "Estonia",
                    "Finland",
                    "France",
                    "Georgia",
                    "Germany",
                    "Greece",
                    "Greenland",
                    "Hungary",
                    "Iceland",
                    "Ireland",
                    "Italy",
                    "Kosovo",
                    "Latvia",
                    "Liechtenstein",
                    "Lithuania",
                    "Luxembourg",
                    "Macedonia",
                    "Malta",
                    "Moldova",
                    "Monaco",
                    "Montenegro",
                    "Netherlands",
                    "North Macedonia",
                    "Norway",
                    "Poland",
                    "Portugal",
                    "Romania",
                    "Russian Federation",
                    "San Marino",
                    "Serbia",
                    "Slovakia",
                    "Slovenia",
                    "Spain",
                    "Sweden",
                    "Switzerland",
                    "Turkey",
                    "Ukraine",
                    "United Kingdom of Great Britain & Northern Ireland"]},
        {continent: "North America", countries:
                ["Anywhere",
                    "Antigua and Barbuda",
                    "Bahamas",
                    "Barbados",
                    "Belize",
                    "Canada",
                    "Costa Rica",
                    "Cuba",
                    "Dominica",
                    "Dominican Republic",
                    "El Salvador",
                    "Grenada",
                    "Guatemala",
                    "Haiti",
                    "Hawaii",
                    "Honduras",
                    "Jamaica",
                    "Mexico",
                    "Nicaragua",
                    "Panama",
                    "Saint Kitts and Nevis",
                    "Saint Lucia",
                    "Saint Vincent and the Grenadines",
                    "Trinidad and Tobago",
                    "United States of America (USA)"]},
        {continent: "South America", countries:
                ["Anywhere",
                    "Argentina",
                    "Bolivia",
                    "Brazil",
                    "Chile",
                    "Colombia",
                    "Ecuador",
                    "Guyana",
                    "Paraguay",
                    "Peru",
                    "Suriname",
                    "Uruguay",
                    "Venezuela"]}];

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

    const handleGenerateButtonClick = async () => {
        const checkedValues = Object.entries(stateCheckbox)
            .filter(([, value]) => value)
            .map(([key]) => key);

        const requestData = {
            continent: selectedContinent,
            country: selectedCountry,
            regionType: checkedValues.join(','),
            month: selectedMonth,
            season: selectedSeason,
            activities: additionalInfoTextBox,
        };

        try {
            // Make a GET request to the backend using Axios
            const response = await axios.get('http://127.0.0.1:8080/api/v1/getRecommendedDestination', {
                params: requestData
            });
            console.log(response.data)
            setChatResponseTextBox(response.data.replace(/\\n/g, '\n'));
            setHasChanges(true);
            // while (response.status != 200) {
            //     console.log("1")
            // }


            // If needed, you can perform additional actions based on the response
            // For example, update other state variables or trigger other functions
        } catch (error: unknown) {
            // Handle errors if needed
            console.error('Error');
        }
    };
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleAddButtonClick = () => {
        window.location.href = '/';
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    const handleContinentChange = (event) => {
        const selectedContinent = event.target.value;
        setSelectedContinent(selectedContinent);
        if (selectedContinent !== 'Anywhere') {
            const continent = countryList.find((c) => c.continent === selectedContinent);
            setFilteredCountries(continent ? continent.countries : []);
            setSelectedCountry(continent && continent.countries.length > 0 ? continent.countries[0] : '');
        } else {
            // If the selected continent is "Anywhere," reset the filtered countries and selected country
            setFilteredCountries([]);
            setSelectedCountry('Anywhere');
        }
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
                                          handleChange={handleContinentChange} selectedContinent={selectedContinent}/>
                            <DropdownItem name="Month" options={monthsList} selectedValue={selectedMonth}
                                          handleChange={handleMonthChange}/>
                        </div>
                        <div className="dropdown-right">
                            <DropdownItem name="Country" options={filteredCountries} selectedValue={selectedCountry}
                                          handleChange={handleCountryChange} selectedContinent={selectedContinent}/>
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
                            <textarea
                                className="chatResponse"
                                value={chatResponseTextBox}
                                onChange={(e) => {
                                    setChatResponseTextBox(e.target.value);
                                    setHasChanges(true);
                                }}
                                readOnly
                                disabled={true}
                            />
                        <Button
                            className="add-button"
                            variant="contained"
                            disabled={!hasChanges}
                            onClick={handleAddButtonClick}
                            style={{
                                backgroundColor: '#f0b17a',
                                fontFamily: 'Palatino',
                                textTransform: 'capitalize',
                            }}
                        >
                            Add
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
                disabled={props.selectedContinent === 'Anywhere' && props.name === 'Country'}
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
