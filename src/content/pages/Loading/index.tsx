import { CircularProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <div
      style={{
        height: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default LoadingPage;
