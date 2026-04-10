import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ padding: "40px" }}>
      <header className="top">
        <div className="title">
          <h1>hdja</h1>
          <p>recipes & tattoos</p>
        </div>

        <div className="links">
          <div>
            <h4>contacts</h4>
            <a href="mailto:heidija.birzniece@gmail.com">
              heidija.birzniece@gmail.com
            </a>
          </div>

          <div>
            <h4>socials</h4>
            <a href="https://linkedin.com/in/heidija-b-aa837a388/" target="_blank">
              linkedin
            </a>
            <br />
            <a href="https://github.com/hdjadied" target="_blank">
              github
            </a>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: "40px", lineHeight: "1.8", maxWidth: "600px" }}>
        <h2>Welcome to hdja</h2>
        <p>
          Hi! This is a collection of my favorite recipes and a showcase of my tattoo work. 
        </p>
        <p>
          Whether you're looking for a delicious recipe to try or interested in seeing my tattoo portfolio, 
          I hope you find something that inspires you. Feel free to reach out if you have any questions.
        </p>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>Explore</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/" style={{ fontSize: "18px", textDecoration: "none", color: "#ad4caf", fontWeight: "bold" }}>
              → Recipes
            </Link>
            <p style={{ margin: "5px 0 0 0", color: "#666" }}>Search and browse all my recipes with ingredient filtering</p>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/tats" style={{ fontSize: "18px", textDecoration: "none", color: "#ad4caf", fontWeight: "bold" }}>
              → Tattoo Portfolio
            </Link>
            <p style={{ margin: "5px 0 0 0", color: "#666" }}>View my tattoo work and available flash designs</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
