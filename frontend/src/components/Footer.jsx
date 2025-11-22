const Footer = () => {
  let date = new Date()

  return (
    <footer>
      <small>
        <span>&copy; Copyright </span>
        <span>{date.getFullYear()} </span>
        <span> - Doruk Emre - </span>
        <a href="https://www.dorukemre.dev/" target="_blank">
          dorukemre.dev
        </a>
      </small>
    </footer>
  )
}

export default Footer
