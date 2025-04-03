import React from "react";
import { Grid } from "@mui/material";
import JobCard from "../JobCard";

const JobList = ({ allJobsData }) => {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexWrap: "wrap",
        marginTop: "200px", // Allow wrapping of items in smaller screens
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
