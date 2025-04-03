import { Grid } from "@mui/material";
import "./App.css";
import JobList from "./components/JobList/index.jsx";
import Navbar from "./components/Navbar/index.jsx";
import { useJobContext } from "./context/useJobContext.jsx";
import { useState } from "react";

function App() {
  const { allJobsData, isLoading, isError } = useJobContext();

  // State variable for selected job types
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 0]);

  //filter jobs data
  const filteredJobs = allJobsData?.filter((job) => {
    const jobTitleCheck = selectedJobTitle
      ? job.jobTitle.toLowerCase().includes(selectedJobTitle.toLowerCase())
      : true;

    const jobLocationCheck =
      selectedLocations?.length > 0
        ? selectedLocations?.some((location) =>
            job?.location.includes(location)
          )
        : true;

    const jobTypeCheck =
      selectedJobTypes?.length > 0
        ? selectedJobTypes?.some((type) => job?.jobType.includes(type))
        : true;

    const salaryRangeCheck = (() => {
      if (salaryRange[0] === 0 && salaryRange[1] === 0) return true;

      // Convert the salary LPA to monthly salary
      const minMonthlySalary = (job?.salary?.min * 100000) / 12;
      const maxMonthlySalary = (job?.salary?.max * 100000) / 12;

      // Convert slider values to thousands
      const minSelectedSalary = salaryRange[0] * 1000;
      const maxSelectedSalary = salaryRange[1] * 1000;

      return (
        minMonthlySalary >= minSelectedSalary &&
        maxMonthlySalary <= maxSelectedSalary
      );
    })();

    return (
      jobTitleCheck && jobLocationCheck && jobTypeCheck && salaryRangeCheck
    );
  });

  console.log({ allJobsData, isLoading, isError });
  console.log({
    selectedJobTitle,
    selectedJobTypes,
    selectedLocations,
    salaryRange,
  });

  console.log("filteredJobs", filteredJobs);

  return (
    <>
      <Grid container sx={{ padding: "0 20px" }}>
        <Navbar
          selectedJobTitle={selectedJobTitle}
          setSelectedJobTitle={setSelectedJobTitle}
          selectedJobTypes={selectedJobTypes}
          setSelectedJobTypes={setSelectedJobTypes}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          salaryRange={salaryRange}
          setSalaryRange={setSalaryRange}
        />
        <JobList allJobsData={filteredJobs} />
      </Grid>
    </>
  );
}

export default App;
