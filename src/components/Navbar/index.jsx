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
  useMediaQuery,
  IconButton,
  Drawer,
  Grid,
} from "@mui/material";
import HomeIcon from "../../assets/GroupIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import LocationIcon from "../../assets/LocationIcon.svg";
import PersonIcon from "../../assets/PersonIcon.svg";
import "./style.css";
import CreateJobDialog from "../CreateJobDialog/index.jsx";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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
  const isMobile = useMediaQuery("(max-width:575px)");
  const isTablet = useMediaQuery("(min-width:576px) and (max-width:768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        <Toolbar className="toolBar" sx={{ gap: 4 }}>
          <img
            src={HomeIcon}
            alt="Home"
            style={{
              height: isTablet ? 35 : 44.68,
              width: isTablet ? 35 : 44,
              cursor: "pointer",
            }}
          />

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flex: "1",
              }}
            >
              {menu.map((menuItem) => (
                <p
                  key={menuItem}
                  className="menuItemNames"
                  style={{
                    fontSize: isTablet ? "12px" : "16px",
                    fontWeight: isTablet ? "600" : "500",
                    cursor: "pointer",
                    color: "#303030",
                  }}
                >
                  {menuItem}
                </p>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Button
              className="createJobBtn"
              sx={{
                width: isTablet ? "100px" : "150px",
                fontSize: isTablet ? "12px" : "16px",
                padding: isTablet ? "12px " : "8px 24px",
                fontWeight: "600",
              }}
              onClick={handleOpenJobForm}
            >
              Create Jobs
            </Button>
          )}

          {isMobile && (
            <IconButton onClick={toggleMobileMenu} sx={{ marginLeft: "auto" }}>
              <MenuIcon sx={{ color: "#222222" }} />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          sx={{
            "& .MuiDrawer-paper": {
              width: "70vw",
              height: "100vh",
              padding: 2,
            },
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            {menu.map((menuItem) => (
              <Typography key={menuItem} className="menuItemNames">
                {menuItem}
              </Typography>
            ))}
            <Button className="createJobBtn" onClick={handleOpenJobForm}>
              Create Jobs
            </Button>
          </Box>
        </Drawer>

        <Grid container className="searchAndFilterContainer" rowGap={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
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
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box
              className="location wh"
              sx={{
                borderLeft: isMobile && "none",
                paddingLeft: !isMobile && "none",
              }}
            >
              <img
                src={LocationIcon}
                alt="Location"
                style={{ height: 18, width: 18, cursor: "pointer" }}
              />
              <FormControl
                sx={{
                  border: "none",
                  "& .MuiInputBase-root": {
                    border: "none",
                    ".MuiSelect-select": {
                      border: "none",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
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
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box
              className="jobType wh"
              sx={{
                borderLeft: isMobile && "none",
                paddingLeft: !isMobile && "none",
              }}
            >
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
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box
              className="range wh"
              sx={{
                borderLeft: isMobile && "none",
                paddingLeft: !isMobile && "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: isTablet ? "10px" : "16px",
                    color: "#222222",
                    fontWeight: "600",
                  }}
                >
                  Salary Per Month{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isTablet ? "11px" : "16px",
                    color: "#222222",
                    fontWeight: "600",
                  }}
                >
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
          </Grid>
        </Grid>
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
