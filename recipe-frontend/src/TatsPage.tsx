import { Link } from "react-router-dom";

function TatsPage() {
  return (
    <div style={{ padding: "40px" }}>
      <header className="top">
        <div className="title">
          <h1><Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>hdja tats</Link></h1>
          <p>tattoo portfolio & information</p>
        </div>

        <div className="links">
          <div>
            <h4>contacts</h4>
            <a href="mailto:heidija.birzniece@gmail.com">
              heidija.birzniece@gmail.com
            </a>
          </div>

          <div>
            <h4>hdja etc.</h4>
            <a href="https://linkedin.com/in/heidija-b-aa837a388/" target="_blank">
              linkedin
            </a>
            <br />
            <a href="https://github.com/hdjadied" target="_blank">
              github
            </a>
          </div>

          <div>
            <h4>projects</h4>
            <Link to="/">recipes</Link>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: "30px", lineHeight: "1.8" }}>
        <a href="#portfolio" style={{ marginRight: "20px" }}>
          portfolio
        </a>
        <a href="#available-flash" style={{ marginRight: "20px" }}>
          available flash
        </a>
        <a href="#fresh-healed">fresh/healed</a>
      </div>

      <section id="portfolio" style={{ marginBottom: "40px" }}>
        <h2>Portfolio</h2>
        <p>Coming soon - showcase of tattoo work</p>
      </section>

      <section id="available-flash" style={{ marginBottom: "40px" }}>
        <h2>Available Flash</h2>
        <p>Coming soon - available flash designs</p>
      </section>

      <section id="fresh-healed" style={{ marginBottom: "40px" }}>
        <h2>Fresh/Healed</h2>
        <p>Coming soon - information about fresh vs healed tattoos</p>
      </section>
    </div>
  );
}

export default TatsPage;
