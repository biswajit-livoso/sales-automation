import { ToastContainer } from 'react-toastify';

function Toast() {
  return (
    <>
      {/* Your routes or layout */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light" // or "dark"
      />
    </>
  );
}
export default Toast;
  
