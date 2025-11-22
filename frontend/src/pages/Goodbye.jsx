import { Link } from 'react-router-dom'

const Goodbye = () => {
  return (
    <article style={{ padding: '100px' }}>
      <h1>Your account has been deleted.</h1>
      <br />
      <div className="">
        <p>
          <Link to="/">Visit Our Homepage</Link>
        </p>
      </div>
    </article>
  )
}

export default Goodbye
