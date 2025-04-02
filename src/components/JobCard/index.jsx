import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import ExpIcon from "../../assets/ExpIcon.svg";
import SalaryRangeIcon from "../../assets/SalaryRangeIcon.svg";
import JobTypeIcon from "../../assets/JobTypeIcon.svg";
import AmazonIcon from "../../assets/AmazonIcon.svg";
import AmazonIcon2 from "../../assets/AmazonIcon2.svg";
import "./style.css";

const JobCard = ({ job }) => {
  const [timeAgo, setTimeAgo] = useState("");

  //to show the time duration job posted
  useEffect(() => {
    if (job?.createdAt) {
      const calculateTimeAgo = () => {
        const createdAtDate = new Date(job.createdAt);
        const now = new Date();
        const diffMs = now - createdAtDate; // Difference in milliseconds

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
          setTimeAgo("Just now");
        } else if (diffHours < 24) {
          setTimeAgo(`${diffHours} ${diffHours < 2 ? "hour" : "hours"} ago`);
        } else {
          setTimeAgo(`${diffDays} ${diffDays < 2 ? "day" : "days"} ago`);
        }
      };

      calculateTimeAgo();
      const interval = setInterval(calculateTimeAgo, 60000); // Update every minute

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [job?.createdAt]);

  return (
    <Card sx={{ m: 2, boxShadow: 3 }} className="cardContainer">
      <CardContent className="cardContent">
        <Grid
          container
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item className="logoIcon">
            <img src={AmazonIcon2} alt="logo" />
          </Grid>
          <Grid item className="durationShow">
            <p>{timeAgo}</p>
          </Grid>
        </Grid>
        <Grid container item xs={12} className="jobTitleText">
          <p>{job?.jobTitle}</p>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item className="experienceSection">
            <img src={ExpIcon} alt="Experience" />
            <p>{`${job?.experience?.min} - ${job?.experience?.max} yrs Exp`}</p>
          </Grid>
          <Grid item className="jobTypeSection">
            {" "}
            <img src={JobTypeIcon} alt="Job type" />
            <p>{job?.jobType[0]}</p>
          </Grid>
          <Grid item className="salarySection">
            {" "}
            <img src={SalaryRangeIcon} alt="Salary" />
            <p>{job?.salary?.max}LPA</p>
          </Grid>
        </Grid>
        <Grid container item xs={12} className="jobDescriptionText">
          <ul>
            {job?.description?.split(".")?.map((point, index) => (
              <li key={index}>
                <p>{point.trim()}</p>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid container item xs={12}>
          {" "}
          <Button fullWidth className="applyBtn">
            Apply Now
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobCard;
