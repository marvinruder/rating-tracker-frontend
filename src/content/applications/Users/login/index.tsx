import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useEffect, useState } from "react";
import SwitchSelector from "react-switch-selector";
import "./switchSelector.css";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import axios from "axios";
import {
  authAPI,
  baseUrl,
  registerEndpoint,
  signInEndpoint,
} from "src/endpoints";

const LoginApp = () => {
  const theme = useTheme();
  const [action, setAction] = useState<"signIn" | "register">("signIn");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    severity: "error" | "info" | "success" | "warning";
    title: string;
    message: string;
  }>(undefined);
  const [snackbarShown, setSnackbarShown] = useState<boolean>(false);

  useEffect(() => setSnackbarShown(status != undefined), [status]);

  const validateEmail = () => {
    return (
      document.getElementById("inputEmail") as HTMLInputElement
    ).reportValidity();
  };

  const validateName = () => {
    return (
      document.getElementById("inputName") as HTMLInputElement
    ).reportValidity();
  };

  const validate = () => {
    if (action === "register") {
      setEmailError(!validateEmail());
      setNameError(!validateName());
    }
  };

  const onButtonClick = () => {
    switch (action) {
      case "register":
        if (validateEmail() && validateName()) {
          axios
            .get(baseUrl + authAPI + registerEndpoint, {
              params: {
                email,
                name,
              },
            })
            .then((res) =>
              SimpleWebAuthnBrowser.startRegistration(res.data).then(
                (authRes) =>
                  axios
                    .post(baseUrl + authAPI + registerEndpoint, authRes, {
                      params: {
                        email,
                        name,
                      },
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                    .then(() =>
                      setStatus({
                        severity: "success",
                        title: "Welcome!",
                        message:
                          "Your registration was successful. Please note that a manual activation of your account may still be necessary before you can access the page.",
                      })
                    )
                    .catch((err) =>
                      setStatus({
                        severity: "error",
                        title: "Error while processing registration response",
                        message:
                          err.response?.data?.message ??
                          err.message ??
                          "No additional information available.",
                      })
                    )
              )
            )
            .catch((err) =>
              setStatus({
                severity: "error",
                title: "Error while requesting registration challenge",
                message:
                  err.response?.data?.message ??
                  err.message ??
                  "No additional information available.",
              })
            );
        }
        break;
      case "signIn":
        axios
          .get(baseUrl + authAPI + signInEndpoint)
          .then((res) =>
            SimpleWebAuthnBrowser.startAuthentication(res.data).then(
              (authRes) =>
                axios
                  .post(
                    baseUrl + authAPI + signInEndpoint,
                    { ...authRes, challenge: res.data.challenge },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then(() =>
                    setStatus({
                      severity: "success",
                      title: "Welcome back!",
                      message: "Authentication successful",
                    })
                  )
                  .catch((err) =>
                    setStatus({
                      severity: "error",
                      title: "Error while processing authorization response",
                      message:
                        err.response?.data?.message ??
                        err.message ??
                        "No additional information available.",
                    })
                  )
            )
          )
          .catch((err) =>
            setStatus({
              severity: "error",
              title: "Error while requesting authentication challenge",
              message:
                err.response?.data?.message ??
                err.message ??
                "No additional information available.",
            })
          );
        break;
    }
  };

  const switchOptions = [
    {
      label: (
        <Typography
          padding={0.5}
          variant="button"
          color={
            action === "signIn"
              ? theme.colors.switchSelector.selected
              : theme.colors.switchSelector.unselected
          }
        >
          Sign in
        </Typography>
      ),
      value: "signIn",
    },
    {
      label: (
        <Typography
          padding={0.5}
          variant="button"
          color={
            action === "register"
              ? theme.colors.switchSelector.selected
              : theme.colors.switchSelector.unselected
          }
        >
          Register
        </Typography>
      ),
      value: "register",
    },
  ];

  return (
    <>
      <Snackbar
        open={snackbarShown}
        autoHideDuration={10000}
        onClose={() => setSnackbarShown(false)}
      >
        <Alert
          onClose={() => setSnackbarShown(false)}
          severity={status?.severity ?? "info"}
          sx={{ maxWidth: "450px" }}
        >
          <AlertTitle>
            <strong>{status?.title}</strong>
          </AlertTitle>
          {status?.message}
        </Alert>
      </Snackbar>
      <Card sx={{ margin: "auto", minWidth: 275 }}>
        <CardContent>
          <Grid container direction={"column"} spacing={2} padding={1}>
            <Grid item>
              <Avatar
                sx={{
                  m: "auto",
                  height: 64,
                  width: 64,
                  color: theme.palette.text.primary,
                }}
              >
                <QueryStatsIcon fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h3" textAlign={"center"}>
                Rating Tracker
              </Typography>
            </Grid>
            <Grid item>
              <SwitchSelector
                options={switchOptions}
                backgroundColor={theme.palette.primary.main}
                selectedBackgroundColor={theme.colors.alpha.white[100]}
                onChange={setAction}
              />
            </Grid>
            <Grid container item direction={"column"} spacing={1}>
              <Grid
                item
                maxHeight={action === "register" ? 60 : 0}
                sx={{
                  opacity: action === "register" ? 1 : 0,
                  transitionProperty: "max-height,opacity",
                  transitionDuration: ".4s,.2s",
                  transitionDelay: action === "register" && "0s,.2s",
                  transitionTimingFunction: `ease`,
                }}
              >
                <TextField
                  id={"inputEmail"}
                  type={"email"}
                  fullWidth
                  label={"Email Address"}
                  value={email}
                  error={emailError}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value);
                    setEmailError(false);
                  }}
                  required
                />
              </Grid>
              <Grid
                item
                maxHeight={action === "register" ? 60 : 0}
                sx={{
                  opacity: action === "register" ? 1 : 0,
                  transitionProperty: "max-height,opacity",
                  transitionDuration: ".4s,.2s",
                  transitionDelay: action === "register" && "0s,.2s",
                  transitionTimingFunction: `ease`,
                }}
              >
                <TextField
                  fullWidth
                  id={"inputName"}
                  label={"Name"}
                  value={name}
                  error={nameError}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                    setNameError(false);
                  }}
                  required
                />
              </Grid>
              <Grid item>
                <Button
                  startIcon={<FingerprintIcon />}
                  variant="contained"
                  disabled={action === "register" && (emailError || nameError)}
                  fullWidth
                  onMouseOver={validate}
                  onClick={onButtonClick}
                >
                  {action === "signIn" ? "Sign in" : "Register"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginApp;
