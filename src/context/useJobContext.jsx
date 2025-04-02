import { useContext } from "react";
import { JobContext } from "./JobsContext.jsx";

export const useJobContext = () => {
 return useContext(JobContext);
};

