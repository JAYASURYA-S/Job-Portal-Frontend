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
          setTimeAgo(`${diffHours}h ago`);
        } else {
          setTimeAgo(`${diffDays}d ago`);
        }
      };

      calculateTimeAgo();
      const interval = setInterval(calculateTimeAgo, 60000); // Update every minute

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [job?.createdAt]);

  //filter the description for empty string
  const filteredDescription =
    job?.description
      ?.split(".")
      ?.map((point) => point.trim())
      ?.filter((point) => point !== "") || [];

  return (
    <Card sx={{ m: 2, boxShadow: 3 }} className="cardContainer">
      <CardContent className="cardContent">
        {/**Company Logo and duration */}
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid className="logoIcon">
            <img src={AmazonIcon2} alt="logo" />
          </Grid>
          <Grid className="durationShow">
            <p>{timeAgo}</p>
          </Grid>
        </Grid>

        {/**Title*/}
        <Grid container className="jobTitleText">
          <p>{job?.jobTitle}</p>
        </Grid>

        {/**Experience, Job type, Salary range*/}
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
          className="expAndTypeAndSalaryContainer"
        >
          <Grid className="experienceSection">
            <img src={ExpIcon} alt="Experience" />
            <p>{`${job?.experience?.min} - ${job?.experience?.max} yrs Exp`}</p>
          </Grid>
          <Grid className="jobTypeSection">
            {" "}
            <img src={JobTypeIcon} alt="Job type" />
            <p>{job?.jobType[0]}</p>
          </Grid>
          <Grid className="salarySection">
            {" "}
            <img src={SalaryRangeIcon} alt="Salary" />
            <p>{job?.salary?.max}LPA</p>
          </Grid>
        </Grid>

        {/**Description*/}
        <Grid container className="jobDescriptionText">
          <ul>
            {filteredDescription?.map((point, index) => (
              <li key={index}>
                <p>{point}</p>
              </li>
            ))}
          </ul>
        </Grid>

        {/**Button*/}
        <Grid container>
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
