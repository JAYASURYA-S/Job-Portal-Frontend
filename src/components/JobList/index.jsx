import React from "react";
import { Grid } from "@mui/material";
import JobCard from "../JobCard";

const JobList = ({ allJobsData }) => {
  return (
    <Grid
      container
      item
      sx={{
        display: "flex",
        flexWrap: "wrap",
        marginTop: "200px", // Allow wrapping of items in smaller screens
      }}
    >
      {allJobsData?.map((job, index) => (
        <Grid item xs={12} sm={2} md={2} key={index}>
          <JobCard job={job} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobList;
