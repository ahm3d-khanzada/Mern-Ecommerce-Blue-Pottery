import { Spinner } from "reactstrap"

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <Spinner color="primary" />
      <span className="ms-2">Loading...</span>
    </div>
  )
}

export default LoadingSpinner

