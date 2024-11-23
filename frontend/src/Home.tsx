import styles from "./Home.module.css";
import mtn from "./assets/hyndman-peak-summit.jpg";
import man from "./assets/pexels-mohammed.jpg";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <header>
        <h1>Immortal Journal</h1>
        <span className={styles.header_nav}>
          <h3>Home</h3>
          <h3>Login</h3>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/journal")}
          >
            Journal
          </h3>
        </span>
      </header>
      <main>
        <section className={styles.section_1}>
          <img src={mtn} alt="" />
          <h1>Whats your story?</h1>
        </section>
        <section className={styles.section_2}>
          <img src={man} alt="" />
          <div className={styles.section_2_right_section}>
            <h1>What are you here to accomplish?</h1>
            <div className={styles.section_2_text_content}>
              <p>
                <strong>Immortal Journal’s</strong> goals:
              </p>
              <ol>
                <li> Prioritize growth in your life.</li>
                <li> Document the unique life stories of all humanity.</li>
              </ol>
              <p>
                Our mission is to document your personal journey, goals,
                insights you wish to share, and life stories you collect along
                the way. Your uploads remain private throughout your life, only
                becoming public after you pass away. Immortal Journal is more
                than just a journal—it’s meant to push you to be your highest
                self and share life’s trials and tribulations with generations
                to come.
              </p>
            </div>
            <div className={styles.button_container}>
              <button>Sign up</button>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <h1>Do it all</h1>
      </footer>
    </div>
  );
};

export default Home;
