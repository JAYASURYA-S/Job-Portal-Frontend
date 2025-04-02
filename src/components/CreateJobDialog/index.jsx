import React from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJobPortal } from "./mutation.js";

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

  const mutation = useMutation({
    mutationFn: postJobPortal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-jobs"] });
      reset();
      onClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

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
    console.log("Payload:", payload);

    mutation.mutate(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "848px",
          height: "779px",
          display: "flex",
          justifyContent: "center",
          borderRadius: "16px",
          //   padding:'10px'
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>Create Job Opening</DialogTitle>
      <DialogContent sx={{ padding: "15px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Job Title & Company Name */}
          <Grid sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
            <Controller
              name="companyName"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Amazon, Microsoft, Swiggy"
                  onChange={(e) => setValue("companyName", e.target.value)}
                  value={getValues("companyName")}
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              )}
            />
          </Grid>

          {/* Location & Job Type */}
          <Grid sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
                      onChange={(e) => setValue("location", e.target.value)}
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
                        <MenuItem key={location.value} value={location.value}>
                          <Checkbox
                            checked={field.value.includes(location.value)}
                          />
                          <ListItemText primary={location.label} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.location && (
                      <FormHelperText>{errors.location.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>

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
                      onChange={(e) => setValue("jobType", e.target.value)}
                      renderValue={(selected) =>
                        selected.length > 0 ? (
                          selected.join(", ")
                        ) : (
                          <p>Choose Job Type</p>
                        )
                      }
                    >
                      {jobTypes?.map((jobType) => (
                        <MenuItem key={jobType.value} value={jobType.value}>
                          <Checkbox
                            checked={field.value.includes(jobType.value)}
                          />
                          <ListItemText primary={jobType.label} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.jobType && (
                      <FormHelperText>{errors.jobType.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>
          </Grid>

          {/* Salary Range & Deadline */}
          <Grid sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
                  onChange={(e) => setValue("salaryMin", e.target.value)}
                  value={getValues("salaryMin")}
                  error={!!errors.salaryMin}
                  helperText={errors.salaryMin?.message}
                />
              )}
            />
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
                  onChange={(e) => setValue("salaryMax", e.target.value)}
                  value={getValues("salaryMax")}
                  error={!!errors.salaryMax}
                  helperText={errors.salaryMax?.message}
                />
              )}
            />

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

          {/* Experience */}
          <Grid sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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

          {/* Job Description */}
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
                onChange={(e) => setValue("description", e.target.value)}
                value={getValues("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </form>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ padding: "15px" }}>
        <Grid
          container
          item
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => console.log("Draft Saved")}
            className="saveDraftBtn"
          >
            <p>Save Draft</p> <img src={SaveDraftIcon} alt="Save Draft" />
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="publishBtn"
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
      </DialogActions>
    </Dialog>
  );
};

export default CreateJobDialog;
