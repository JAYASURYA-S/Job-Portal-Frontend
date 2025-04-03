import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import axiosInstance from "../axiosInstance.js";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  //getting all the jobs details
  const {
    data: allJobsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-jobs"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/jobs");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  // console.log({ allJobsData, isLoading, isError, error });

  return (
    <JobContext.Provider value={{ allJobsData, isLoading, isError, error }}>
      {children}
    </JobContext.Provider>
  );
};

export { JobContext };
