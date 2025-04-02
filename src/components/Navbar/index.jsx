import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  InputBase,
  Slider,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import HomeIcon from "../../assets/GroupIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import LocationIcon from "../../assets/LocationIcon.svg";
import PersonIcon from "../../assets/PersonIcon.svg";
import "./style.css";
import CreateJobDialog from "../CreateJobDialog/index.jsx";

const Navbar = ({
  selectedJobTitle,
  setSelectedJobTitle,
  selectedJobTypes,
  setSelectedJobTypes,
  selectedLocations,
  setSelectedLocations,
  salaryRange,
  setSalaryRange,
}) => {
  const [menu] = useState([
    "Home",
    "Find Jobs",
    "Find Talents",
    "About Us",
    "Testimonials",
  ]);

  // state variables
  const [openDialog, setOpenDialog] = useState(false);

  // State variable for job type options
  const jobTypes = [
    { value: "Full Time", label: "Full-time" },
    { value: "Part Time", label: "Part-time" },
    { value: "Internship", label: "Internship" },
    { value: "Contract", label: "Contract" },
  ];

  // State variable for job type options
  const locations = [
    { value: "Chennai", label: "Chennai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Salem", label: "Salem" },
  ];

  //Handle job title selection change
  const handleJobTitleChange = (e) => {
    setSelectedJobTitle(e.target.value);
  };

  // Handle job type selection change
  const handleJobTypeChange = (e) => {
    setSelectedJobTypes(e.target.value);
  };

  // Handle location selection change
  const handleLocationChange = (e) => {
    setSelectedLocations(e.target.value);
  };

  // Handle the change of salary range
  const handleSalaryRangeChange = (e, newValue) => {
    if (Array.isArray(newValue)) {
      setSalaryRange(newValue); // Update state with the new salary range
    }
  };

  //handle open form
  const handleOpenJobForm = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <AppBar className="appBar" position="fixed">
        <Toolbar className="toolBar">
          <img
            src={HomeIcon}
            alt="Home"
            style={{ height: 44.68, width: 44, cursor: "pointer" }}
          />

          <Box sx={{ display: "flex", gap: 6 }}>
            {menu.map((menuItem) => (
              <Typography key={menuItem} className="menuItemNames">
                {menuItem}
              </Typography>
            ))}
          </Box>

          <Button className="createJobBtn" onClick={() => handleOpenJobForm()}>
            Create Jobs
          </Button>
        </Toolbar>

        {/* Search and Filters */}
        <Box className="searchAndFilterContainer">
          <Box className="search wh">
            <img
              src={SearchIcon}
              alt="Search"
              style={{ height: 18, width: 18, cursor: "pointer" }}
            />
            <InputBase
              placeholder="Search By Job Title, Role"
              fullWidth
              className="searchText"
              value={selectedJobTitle}
              onChange={handleJobTitleChange}
            />
          </Box>

          {/* Preferred Location Dropdown */}
          <Box className="location wh">
            <img
              src={LocationIcon}
              alt="Location"
              style={{ height: 18, width: 18, cursor: "pointer" }}
            />
            <FormControl
              sx={{
                border: "none", // Remove border from FormControl
                "& .MuiInputBase-root": {
                  border: "none", // Remove border from the input field
                  ".MuiSelect-select": {
                    border: "none", // Remove border around the select dropdown area
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Remove the notched outline (border) in the OutlinedInput variant
                },
                // "& .MuiSelect-icon": {
                //   display: "none", // Optionally hide the dropdown arrow
                // },
              }}
              variant="outlined"
              fullWidth
            >
              <InputLabel className="locationText">
                Preferred Location
              </InputLabel>
              <Select
                multiple
                value={selectedLocations}
                onChange={handleLocationChange}
                renderValue={(selected) => {
                  return selected.join(", "); // Show selected items as a comma-separated string
                }}
              >
                {locations.map((location) => (
                  <MenuItem key={location.value} value={location.value}>
                    <Checkbox
                      checked={selectedLocations.includes(location.value)}
                    />
                    <ListItemText primary={location.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Job Type Dropdown */}
          <Box className="jobType wh">
            <img
              src={PersonIcon}
              alt="Type"
              style={{ height: 18, width: 18, cursor: "pointer" }}
            />
            <FormControl
              sx={{
                border: "none", // Remove border from FormControl
                "& .MuiInputBase-root": {
                  border: "none", // Remove border from the input field
                  ".MuiSelect-select": {
                    border: "none", // Remove border around the select dropdown area
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Remove the notched outline (border) in the OutlinedInput variant
                },
                // "& .MuiSelect-icon": {
                //   display: "none", // Optionally hide the dropdown arrow
                // },
              }}
              variant="outlined"
              fullWidth
            >
              <InputLabel className="jobTypeText">Job Type</InputLabel>
              <Select
                multiple
                value={selectedJobTypes}
                onChange={handleJobTypeChange}
                renderValue={(selected) => {
                  return selected.join(", "); // Show selected items as a comma-separated string
                }}
              >
                {jobTypes.map((jobType) => (
                  <MenuItem key={jobType.value} value={jobType.value}>
                    <Checkbox
                      checked={selectedJobTypes.includes(jobType.value)}
                    />
                    <ListItemText primary={jobType.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Salary Slider */}
          <Box className="range wh">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // width: "100%",
              }}
            >
              <Typography className="rangeText">Salary Per Month </Typography>
              <Typography className="rangeNumber">
                {" "}
                ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
              </Typography>
            </Box>

            <Slider
              value={salaryRange} // Controlled value from the state variable
              onChange={handleSalaryRangeChange} // Update the state when the slider changes
              valueLabelDisplay="auto" // Show value when dragging the slider
              valueLabelFormat={(value) => `₹${value}k`} // Format the value displayed above the slider
              min={0}
              max={100}
              sx={{ width: "100%", color: "#222222" }}
            />
          </Box>
        </Box>
      </AppBar>

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        jobTypes={jobTypes}
        locations={locations}
      />
    </>
  );
};

export default Navbar;
