"use client";
// import ClipLoader from "react-spinners/ClipLoader";
import BounceLoader from "react-spinners/BounceLoader";

// const override = {
//   display: "block",
//   margin: "100px auto",
// };

// const LoadingPage = ({ loading }) => {
//   return (
//     <ClipLoader
//       color="#3b82f6"
//       loading={loading}
//       cssOverride={override}
//       size={150}
//       aria-label="Loading Spinner"
//     />
//   );
// };

const override = {
  display: "block",
  margin: "100px auto",
};

const Spinner = ({ loading }) => {
  return (
    <BounceLoader
      color="#3b82f6"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
};

export default Spinner;
