import axiosInstance from "../../axiosInstance.js";

export const postJobPortal = async (payload) => {
  try {
    const response = await axiosInstance.post("/jobs", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    // alert(error.message);
  }
};

export const postDraftJob = async (payload) => {
  try {
    const response = await axiosInstance.post("/jobs/drafts", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    // alert(error.message);
  }
};
