import { logoMongoDBSpring, logoNodejs, logoReact } from '../assets/images'

const About = () => {
  return (
    <main id="about-page">
      <section className="contact">
        <h1>Website designed and developed by Doruk Emre</h1>
        <br />
        <p>
          For my other projects, visit:{' '}
          <a href="https://www.dorukemre.dev/" target="_blank">
            dorukemre.dev
          </a>
        </p>
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
  )
}

export default About
