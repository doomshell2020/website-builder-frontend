import React from "react";

const Loader: React.FC = () => {
  return (
    <>
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
      <style>{`
        .loader-wrapper {
        padding-top:20px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;   /* take parent width */
          height: 100%;  /* take parent height */
        }
        .loader {
          width: 50px;
          aspect-ratio: 1;
          --_c: no-repeat radial-gradient(farthest-side, #2087f4ff 92%, #0000);
          background:
            var(--_c) top,
            var(--_c) left,
            var(--_c) right,
            var(--_c) bottom;
          background-size: 12px 12px;
          animation: l7 0.5s infinite linear; /* faster speed */
        }
        @keyframes l7 {
          to {
            transform: rotate(0.5turn);
          }
        }
      `}</style>
    </>
  );
};

export default Loader;