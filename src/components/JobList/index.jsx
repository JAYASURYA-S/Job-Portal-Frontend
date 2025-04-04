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
        marginTop: isMobile ? "400px" : "200px", // Allow wrapping of items in smaller screens
      }}
    >
      {allJobsData?.map((job, index) => (
        <Grid container key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
          <JobCard job={job} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobList;
