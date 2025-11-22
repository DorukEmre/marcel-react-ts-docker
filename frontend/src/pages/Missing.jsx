import { Link, useNavigate } from 'react-router-dom'

const Missing = () => {
  const navigate = useNavigate()
  return (
    <article style={{ padding: '100px' }}>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <br />
      <div className="">
        <p>
          <Link to="/">Visit Our Homepage</Link>
          <span> or </span>
          <button className="go-back-button" onClick={() => navigate(-1)}>
            Go back
          </button>
        </p>
      </div>
    </article>
  )
}

export default Missing
