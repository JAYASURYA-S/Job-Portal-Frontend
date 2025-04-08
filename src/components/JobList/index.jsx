import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import JobCard from "../JobCard";

const JobList = ({ allJobsData }) => {
  const isMobile = useMediaQuery("(max-width:575px)");
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: isMobile && "center",
        marginTop: isMobile ? "400px" : "200px", // Allow wrapping of items in smaller screens
        // gap: "10px",
      }}
    >
      {allJobsData?.map((job, index) => (
        <Grid container key={index}>
          <JobCard job={job} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobList;
