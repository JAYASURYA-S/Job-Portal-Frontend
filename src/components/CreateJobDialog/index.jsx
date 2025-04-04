import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
  Grid,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./style.css";
import SaveDraftIcon from "../../assets/SaveDraftIcon.svg";
import PublishButtonIcon from "../../assets/PublishButtonIcon.svg";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDraft,
  getJobDrafts,
  postDraftJob,
  postJobPortal,
} from "./mutation.js";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const CreateJobDialog = ({ open, onClose, jobTypes, locations }) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: [],
      jobType: [],
      salaryMin: "",
      salaryMax: "",
      expMin: "",
      expMax: "",
      deadline: null,
      description: "",
    },
  });

  const queryClient = useQueryClient();

  //getting all the jobs details
  const { data: allDraftsJobsData } = useQuery({
    queryKey: ["all-drafts-jobs"],
    queryFn: getJobDrafts,
  });

  //state variables
  const [openSavedDialog, setOpenSavedDialog] = useState(false);
  const [isDraftEdit, setIsDraftEdit] = useState(false);
  const [draftIdToDelete, setDraftIdToDelete] = useState("");

  //post job data
  const mutation = useMutation({
    mutationFn: postJobPortal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      reset();
      onClose();
      //trigger the delete drafts if its saved
      if (isDraftEdit) {
        mutationDeleteDraft.mutate(draftIdToDelete);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //post draft data
  const mutationSaveDraft = useMutation({
    mutationFn: postDraftJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-drafts-jobs"] });
      reset();
      onClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //delete draft data
  const mutationDeleteDraft = useMutation({
    mutationFn: deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-drafts-jobs"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //handle Save draft
  const handleSaveDraft = () => {
    if (isDraftEdit) return alert("This draft is already saved");

    //check minimum experience and maximum experience
    const minOrMaxExp = getValues("expMin") || getValues("expMax");
    const minAndMaxExp = getValues("expMin") && getValues("expMax");

    //check minimum experience and maximum salary
    const minOrMaxSal = getValues("salaryMin") || getValues("salaryMax");
    const minAndMaxSal = getValues("salaryMin") && getValues("salaryMax");

    // Check if at least one field has a value
    const hasValue = Object.values(getValues()).some((val) =>
      Array.isArray(val)
        ? val.length > 0
        : minOrMaxExp
        ? minAndMaxExp
        : minOrMaxSal
        ? minAndMaxSal
        : val
    );

    if (!hasValue) {
      if (!minOrMaxExp && !minAndMaxExp) {
        return alert("Enter min and max experience");
      }

      if (!minOrMaxSal && !minAndMaxSal) {
        return alert("Enter min and max salary");
      }

      return alert("Enter some values");
    }

    //payload for the api
    const payload = {
      ...(getValues("jobTitle") && { jobTitle: getValues("jobTitle") }),
      ...(getValues("companyName") && {
        companyName: getValues("companyName"),
      }),
      ...(getValues("location").length > 0 && {
        location: getValues("location"),
      }),
      ...(getValues("deadline") && { deadline: getValues("deadline") }),
      ...(getValues("expMin") &&
        getValues("expMax") && {
          experience: {
            min: getValues("expMin"),
            max: getValues("expMax"),
          },
        }),
      ...(getValues("salaryMin") &&
        getValues("salaryMax") && {
          salary: {
            min: getValues("salaryMin"),
            max: getValues("salaryMax"),
          },
        }),
      ...(getValues("jobType").length > 0 && { jobType: getValues("jobType") }),
      ...(getValues("description") && {
        description: getValues("description"),
      }),
    };
    // console.log("Payload:", payload);

    mutationSaveDraft.mutate(payload);
  };

  //handle Saved Drafts edit open
  const handleSavedDraftsOpen = () => {
    setOpenSavedDialog(true);
  };

  //handle Saved Drafts delete
  const handleDelete = (id) => {
    mutationDeleteDraft.mutate(id);
    setOpenSavedDialog(true);
  };

  //handle Saved Drafts delete
  const handleEdit = (draft) => {
    setDraftIdToDelete(draft._id);
    setOpenSavedDialog(false);
    setIsDraftEdit(true);

    // Populate form with draft values
    setValue("jobTitle", draft?.jobTitle || "");
    setValue("companyName", draft?.companyName || "");
    setValue("location", draft?.location || []);
    setValue("jobType", draft?.jobType || []);
    setValue("salaryMin", draft?.salary?.min || "");
    setValue("salaryMax", draft?.salary?.max || "");
    setValue("expMin", draft?.experience?.min || "");
    setValue("expMax", draft?.experience?.max || "");
    setValue(
      "deadline",
      draft?.deadline !== null && draft?.deadline !== undefined
        ? new Date(draft.deadline)
        : null
    );
    setValue("description", draft.description || "");
  };

  //handle onSubmit
  const onSubmit = (data) => {
    console.log("Job Data:", data);

    const payload = {
      jobTitle: getValues("jobTitle"),
      companyName: getValues("companyName"),
      location: getValues("location"),
      deadline: getValues("deadline"),
      experience: {
        min: getValues("expMin"),
        max: getValues("expMax"),
      },
      jobType: getValues("jobType"),
      salary: {
        min: getValues("salaryMin"),
        max: getValues("salaryMax"),
      },
      description: getValues("description"),
    };
    // console.log("Payload:", payload);

    mutation.mutate(payload);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          reset();
          onClose();
          setIsDraftEdit(false);
        }}
        fullWidth
        //  maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "848px",
            height: "779px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "16px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Create Job Opening
        </DialogTitle>
        <DialogContent sx={{ padding: "10px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container rowGap={1}>
              {/* Job Title & Company Name */}
              <Grid
                container
                size={12}
                rowGap={1}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Job Title</p>
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="jobTitle"
                      control={control}
                      rules={{ required: "Job title is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Search Title"
                          onChange={(e) => setValue("jobTitle", e.target.value)}
                          value={getValues("jobTitle")}
                          error={!!errors.jobTitle}
                          helperText={errors.jobTitle?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Company Name</p>
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="companyName"
                      control={control}
                      rules={{ required: "Company name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Amazon, Microsoft, Swiggy"
                          onChange={(e) =>
                            setValue("companyName", e.target.value)
                          }
                          value={getValues("companyName")}
                          error={!!errors.companyName}
                          helperText={errors.companyName?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Location & Job Type */}
              <Grid
                container
                size={12}
                rowGap={1}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Location</p>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth error={!!errors.location}>
                      <Controller
                        name="location"
                        control={control}
                        rules={{ required: "Select at least one location" }}
                        // placeholder="Choose Preferred Location"
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              multiple
                              displayEmpty
                              onChange={(e) =>
                                setValue("location", e.target.value)
                              }
                              value={getValues("location")}
                              // error={!!errors.location}
                              // helperText={errors.location?.message}
                              renderValue={(selected) =>
                                selected.length > 0 ? (
                                  selected.join(", ")
                                ) : (
                                  <p>Choose Preferred Location</p>
                                )
                              }
                            >
                              {locations?.map((location) => (
                                <MenuItem
                                  key={location.value}
                                  value={location.value}
                                >
                                  <Checkbox
                                    checked={field.value.includes(
                                      location.value
                                    )}
                                  />
                                  <ListItemText primary={location.label} />
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.location && (
                              <FormHelperText>
                                {errors.location.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Job Type</p>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth error={!!errors.jobType}>
                      <Controller
                        name="jobType"
                        control={control}
                        rules={{ required: "Select at least one job type" }}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              multiple
                              displayEmpty
                              value={getValues("jobType")}
                              onChange={(e) =>
                                setValue("jobType", e.target.value)
                              }
                              renderValue={(selected) =>
                                selected.length > 0 ? (
                                  selected.join(", ")
                                ) : (
                                  <p>Choose Job Type</p>
                                )
                              }
                            >
                              {jobTypes?.map((jobType) => (
                                <MenuItem
                                  key={jobType.value}
                                  value={jobType.value}
                                >
                                  <Checkbox
                                    checked={field.value.includes(
                                      jobType.value
                                    )}
                                  />
                                  <ListItemText primary={jobType.label} />
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.jobType && (
                              <FormHelperText>
                                {errors.jobType.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Salary Range & Deadline */}
              <Grid
                container
                size={12}
                rowGap={1}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Salary Range</p>
                  </Grid>
                  <Grid
                    container
                    size={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid size={5.5}>
                      <Controller
                        name="salaryMin"
                        control={control}
                        rules={{
                          required: "Min salary is required",
                          validate: (value) =>
                            !watch("salaryMax") ||
                            Number(value) < Number(watch("salaryMax")) ||
                            "Min salary must be less than Max salary",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Min Salary (₹)"
                            type="number"
                            fullWidth
                            onChange={(e) =>
                              setValue("salaryMin", e.target.value)
                            }
                            value={getValues("salaryMin")}
                            error={!!errors.salaryMin}
                            helperText={errors.salaryMin?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={5.5}>
                      {" "}
                      <Controller
                        name="salaryMax"
                        control={control}
                        rules={{
                          required: "Max salary is required",
                          validate: (value) =>
                            !watch("salaryMin") ||
                            Number(value) > Number(watch("salaryMin")) ||
                            "Max salary must be greater than Min salary",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Max Salary (₹)"
                            type="number"
                            fullWidth
                            onChange={(e) =>
                              setValue("salaryMax", e.target.value)
                            }
                            value={getValues("salaryMax")}
                            error={!!errors.salaryMax}
                            helperText={errors.salaryMax?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Application Deadline</p>
                  </Grid>
                  <Grid size={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="deadline"
                        control={control}
                        rules={{ required: "Deadline is required" }}
                        render={({ field }) => (
                          <DatePicker
                            // label="Application Deadline"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) =>
                              setValue("deadline", date?.toISOString())
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.deadline,
                                helperText: errors.deadline?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>

              {/* Experience */}
              <Grid
                container
                size={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid container size={{ xs: 12, sm: 5.5 }} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Experience</p>
                  </Grid>
                  <Grid
                    container
                    size={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid size={5.5}>
                      <Controller
                        name="expMin"
                        control={control}
                        rules={{
                          required: "Experience Min is required",
                          validate: (value) =>
                            !watch("expMax") ||
                            Number(value) < Number(watch("expMax")) ||
                            "Min experience must be less than Max experience",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Min"
                            type="number"
                            fullWidth
                            onChange={(e) => setValue("expMin", e.target.value)}
                            value={getValues("expMin")}
                            error={!!errors.expMin}
                            helperText={errors.expMin?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={5.5}>
                      <Controller
                        name="expMax"
                        control={control}
                        rules={{
                          required: "Experience Max is required",
                          validate: (value) =>
                            !watch("expMin") ||
                            Number(value) > Number(watch("expMin")) ||
                            "Max experience must be greater than Min experience",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Max"
                            type="number"
                            fullWidth
                            onChange={(e) => setValue("expMax", e.target.value)}
                            value={getValues("expMax")}
                            error={!!errors.expMax}
                            helperText={errors.expMax?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Job Description */}
              <Grid
                container
                size={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid container size={12} rowGap={1}>
                  <Grid size={12}>
                    <p className="heading">Job Description</p>
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Please share a description to let the candidate know more about the job role"
                          multiline
                          rows={4}
                          fullWidth
                          onChange={(e) =>
                            setValue("description", e.target.value)
                          }
                          value={getValues("description")}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ padding: "10px " }}>
          <Grid
            container
            rowGap={2}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                onClick={() => handleSaveDraft()}
                disabled={mutationSaveDraft.isPending}
                className="saveDraftBtn"
                fullWidth
              >
                {mutationSaveDraft?.isPending ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "#222222",
                    }}
                  />
                ) : (
                  <>
                    {" "}
                    <p>Save Draft</p>{" "}
                    <img src={SaveDraftIcon} alt="Save Draft" />
                  </>
                )}
              </Button>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Button
                onClick={() => handleSavedDraftsOpen()}
                className="openDraftBtn"
                fullWidth
              >
                <p>Open Drafts</p> <img src={SaveDraftIcon} alt="Open Draft" />
              </Button>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isPending}
                className="publishBtn"
                fullWidth
              >
                {mutation?.isPending ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "white",
                    }}
                  />
                ) : (
                  <>
                    {" "}
                    <p>Publish</p> <img src={PublishButtonIcon} alt="Publish" />
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      {/**Drafts Job Dialog box */}
      <Dialog
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "848px",
            height: "400px",
            // display: "flex",
            // justifyContent: "center",
            borderRadius: "16px",
            padding: "10px",
          },
        }}
        open={openSavedDialog}
        onClose={() => setOpenSavedDialog(false)}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Job Drafts</DialogTitle>
        <DialogContent>
          <Grid container rowGap={2}>
            {allDraftsJobsData?.length === 0 ? (
              <Grid
                container
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <strong>Draft is empty</strong>
              </Grid>
            ) : (
              allDraftsJobsData?.map((draft, index) => {
                const fields = Object.keys(draft).filter(
                  (key) =>
                    key !== "_id" &&
                    key !== "__v" &&
                    key !== "createdAt" &&
                    key !== "updatedAt"
                );

                return (
                  <Grid
                    container
                    key={index}
                    size={12}
                    sx={{
                      border: "1px solid grey",
                      borderRadius: "8px",
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Grid container size={12} sx={{ alignItems: "center" }}>
                      <>
                        {fields?.map((field, i) => {
                          let value = draft[field];

                          if (field === "deadline") {
                            value = dayjs(value).format("DD/MM/YYYY");
                          }

                          if (Array.isArray(value)) {
                            value = value.join(", ");
                          } else if (
                            typeof value === "object" &&
                            value !== null
                          ) {
                            // Convert object to JSON string (or format it as needed)
                            // value = JSON.stringify(value, null, 2);
                            value = `${value.min} to ${value.max}`;
                          }

                          return (
                            <>
                              <Grid
                                container
                                key={i}
                                size={8}
                                alignItems="center"
                              >
                                <p
                                  style={{
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <strong>{field}</strong> - {value}
                                </p>
                              </Grid>
                            </>
                          );
                        })}
                        <Grid
                          size={4}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <IconButton onClick={() => handleEdit(draft)}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(draft._id)}>
                            <Delete color="error" />
                          </IconButton>
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                );
              })
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateJobDialog;
