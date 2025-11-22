import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { scrollDownIcon } from '../assets/icons'
import {
  catMainLogo,
  phoneExplore,
  phoneFeed,
  phoneSpot,
  logoMongoDBSpring,
  logoNodejs,
  logoReact,
} from '../assets/images'
import Footer from '../components/Footer'

const Home = () => {
  const ref = useRef(null)
  const handleScrollDown = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main id="home-page">
        <section className="hero-container">
          <div className="hero-title-container">
            <h1>
              <span className="Marcel">Marcel</span>
              <span className="outdoor-cat"> the cat</span>
            </h1>
          </div>
          <div className="hero-image-container">
            <img src={catMainLogo} alt="cat logo" />
          </div>
          <button className="hero--scroll-down-icon" onClick={handleScrollDown}>
            <img src={scrollDownIcon} alt="" />
          </button>
        </section>

        <section className="screenshots" ref={ref}>
          <section className="screenshots--cards-container">
            <div className="screenshots--card--wrapper">
              <h3 className="screenshots--card--title">
                Take pictures of cats
              </h3>
              <p className="screenshots--card--description">
                Use your camera or upload pictures from your gallery
              </p>
              <div className="screenshots--card--image-container">
                <img
                  src={phoneSpot}
                  alt="screenshot of file upload page"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="screenshots--card--wrapper">
              <h3 className="screenshots--card--title">Share</h3>
              <p className="screenshots--card--description">
                Connect with people and discover cats from all around the world
              </p>
              <div className="screenshots--card--image-container">
                <img
                  src={phoneFeed}
                  alt="screenshot of main feed"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="screenshots--card--wrapper">
              <h3 className="screenshots--card--title">Explore</h3>
              <p className="screenshots--card--description">
                Track the cats of your friend groups
              </p>
              <div className="screenshots--card--image-container">
                <img
                  src={phoneExplore}
                  alt="screenshot of cat markers on a map"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </section>

        <section className="description">
          <p>Marcel the Cat is a free photo sharing web application.</p>
          <p>
            Upload photos to our service and share them with the world. View,
            comment and like posts. Track the location of the cats with a
            selected group of friends.
          </p>
          <div className="description--signup">
            <Link to="/signup" className="description--signup--link">
              Sign up
            </Link>
          </div>
        </section>

        <section className="tools">
          <div className="tools-container">
            <p className="tools--title">Made using</p>
            <div className="tools--apps">
              <div className="tools--app--logo-container">
                <img src={logoMongoDBSpring} alt="MongoDB" height="50" />
              </div>
              <div className="tools--app--logo-container">
                <p className="logo-express">express</p>
              </div>
              <div className="tools--app--logo-container logo-react">
                <img src={logoReact} alt="React" height="50" />
                <p className="logo-react--text">React</p>
              </div>
              <div className="tools--app--logo-container">
                <img src={logoNodejs} alt="Node.js" height="50" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
