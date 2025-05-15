import React, { useState } from 'react'
import './Explore.css'
import RightSidebar from './RightSidebar.jsx'
import OverviewDefault from './OverviewDefault'
import { motion } from 'framer-motion'
import structure from '../../assets/structure.png'
import bragg from '../../assets/bragg.png'
import optical from '../../assets/optical.png'
import { Link } from 'react-router-dom'


const Explore = () => {
  const [activeTab, setActiveTab] = useState("")

  return (
    <div className="explore-container">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <h3>In this article</h3>
        <ul>
          <li><a href="#overview">What is a Fiber Bragg Grating?</a></li>
          <li><a href="#working">How Does It Work?</a></li>
          <li><a href="#applications">Real-World Applications</a></li>
          <li><a href="#advantages">Advantages of Using FBG Sensors</a></li>
          <li><a href="#need">Why Should You Care?</a></li>
          {/* <li><a href="#appendix">Appendix</a></li> */}
        </ul>
        {/* Quiz & More Section */}
<div className="sidebar-extra">
<div className="quiz-section">
    <h3>🔥 Try a Quick Quiz</h3>
    <p>See how well you understand Fiber Bragg Gratings.</p>
    <Link to="/explore-quiz" className="quiz-button">
      Start Quiz
    </Link>
  </div>

  <div className="bonus-links">
    <h5>🧭 Explore More:</h5>
    <ul>
    <li><Link to="/fiber-comparison">Bragg Wavelength Shift</Link></li>

      <li><a href="#material-effects">Material Effects</a></li>
      <li><a href="#grating-design">Grating Design</a></li>
    </ul>
  </div>
</div>

      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="hero-section">
          {/* Video Background (optional) */}
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/media/fiber-bg.mp4" type="video/mp4" />
          </video>

          {/* Animated Text Content */}
          <motion.div
            className="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>
              <span className="highlight-animated">Fiber Bragg Gratings</span>: A Window Into Light and Matter
            </h1>
            <p className="tagline">
              Explore the physics, beauty, and applications of optical sensing with cutting-edge simulations.
            </p>
          </motion.div>

        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs"> 
            <button className={`tab ${activeTab === "" ? "active" : ""}`} onClick={() => setActiveTab("")}>None</button>
            <button className={`tab ${activeTab === "Terminology" ? "active" : ""}`} onClick={() => setActiveTab("Terminology")}>Terminology</button>
            <button className={`tab ${activeTab === "Fiber" ? "active" : ""}`} onClick={() => setActiveTab("Fiber")}>Fiber</button>
            <button className={`tab ${activeTab === "Gratings" ? "active" : ""}`} onClick={() => setActiveTab("Gratings")}>Gratings</button>
          </div>
        </div>


        {/* Tab Content */}
        {activeTab === "Terminology" && (
          <motion.section
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="animated-heading">🧬 Fiber Bragg Grating – Key Terminologies</h2>
            <p className="subheading">
              <em>Before diving into simulations, let’s break down the language of FBGs.</em>
            </p>

            <div className="fbg-terms-container">
              {/* Term 1 */}
              <motion.div
                className="fbg-term-card"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3>🔷 Bragg Wavelength (λ<sub>Bragg</sub>)</h3>
                <p>
                  The specific wavelength of light that is reflected by the grating structure. It satisfies the Bragg condition:
                </p>
                <div className="equation-box">
                  <strong>λ<sub>Bragg</sub> = 2n<sub>eff</sub>Λ</strong>
                </div>
                <p className="equation-description">
                  where <strong>n<sub>eff</sub></strong> is the effective refractive index and <strong>Λ</strong> is the grating period.
                </p>
              </motion.div>

              {/* Term 2 */}
              <motion.div
                className="fbg-term-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3>🌐 Grating Period (Λ)</h3>
                <p>
                  The distance between two consecutive changes in the refractive index. Smaller periods reflect shorter wavelengths.
                </p>
              </motion.div>

              {/* Term 3 */}
              <motion.div
                className="fbg-term-card"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>📈 Strain Sensitivity</h3>
                <p>
                  A change in the grating’s length (due to strain) changes the Bragg wavelength. This forms the basis for strain sensing.
                </p>
              </motion.div>

              {/* Term 4 */}
              <motion.div
                className="fbg-term-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3>🔥 Temperature Sensitivity</h3>
                <p>
                  Changes in temperature affect both the grating period and refractive index, shifting λ<sub>Bragg</sub>.
                </p>
              </motion.div>

              {/* Term 5 */}
              <motion.div
                className="fbg-term-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3>📶 Reflectivity (R)</h3>
                <p>
                  Indicates how much of the light is reflected at the Bragg wavelength. Higher index modulation leads to higher reflectivity.
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {activeTab === "Fiber" && (
          <motion.section
            className="tab-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="animated-heading">The Optical Fiber: Heart of the FBG</h2>
            <p className="subheading">
              <em>Where light travels, senses, and gets transformed.</em>
            </p>

            <div className="fiber-section">
              {/* Introduction to Fiber */}
              <div className="fiber-block">
                <h3>🌐 What is an Optical Fiber?</h3>
                <p>
                  At its core, an optical fiber is a cylindrical waveguide made of glass or plastic that transmits light over long distances with minimal loss.
                  For Fiber Bragg Gratings, the fiber is more than just a passive channel—it's an active sensor.
                </p>
                <img src={optical} alt="Optical Fiber Structure" />
                <figcaption>Fig: Typical optical fiber with core, cladding, and coating.</figcaption>
              </div>

              {/* Fiber Structure */}
              <motion.div
                className="fiber-block"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <h3>🧱 Fiber Structure</h3>
                <ul className="styled-list">
                  <li><strong>Core:</strong> Central region where light propagates.</li>
                  <li><strong>Cladding:</strong> Surrounds the core and provides total internal reflection.</li>
                  <li><strong>Coating:</strong> Protective layer against moisture, pressure, and physical damage.</li>
                </ul>
                {/* <img src="/images/fiber-cross-section.png" alt="Fiber Cross Section" />
        <figcaption>Fig: Cross-sectional view showing fiber layers.</figcaption> */}
              </motion.div>

              {/* Relevance in Sensing */}
              <motion.div
                className="fiber-block"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3>🎯 Why the Fiber Matters in Sensing?</h3>
                <p>
                  The material properties, geometry, and coating determine how strain and temperature changes affect the refractive index and length of the fiber—
                  both crucial for Bragg wavelength shifts. The fiber literally stretches, compresses, or heats up, and the light tells the story.
                </p>
                <img src="/images/fiber-strain-temp.png" alt="Strain and Temp Effects" />
                <figcaption>Fig: Influence of strain and temperature on fiber properties.</figcaption>
              </motion.div>

              {/* Equation pop-up */}
              <motion.div
                className="fiber-equation-box"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <h4 className="equation-heading">Bragg Wavelength Equation:</h4>
                <div className="equation-box">
                  <span>λ<sub>B</sub> = 2n<sub>eff</sub>Λ</span>
                </div>
                <p className="equation-description">
                  Where λ<sub>B</sub> is the Bragg wavelength, n<sub>eff</sub> is the effective refractive index, and Λ is the grating period.
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}


        {activeTab === "Gratings" && (
          <motion.div
            className="tab-content gratings-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="fancy-heading">Inside the Grating: Where Light Gets Selective</h2>

            <p>
              At the heart of every Fiber Bragg Grating lies a delicate, periodic structure—an optical barcode etched into the core of a fiber. This is where the magic happens.
              These gratings are formed by exposing a photosensitive optical fiber to a periodic pattern of ultraviolet light. The exposure modifies the refractive index of the fiber core in a repeating fashion, creating tiny mirrors spaced at precise intervals. This structure reflects specific wavelengths of light, creating a sharp notch in the transmission spectrum—known as the <strong>Bragg reflection</strong>.
            </p>

            <motion.figure
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="media-block"
            >
              <img src={structure} alt="Fiber Grating Structure" />
              <figcaption>Schematic showing periodic modulation in refractive index along the fiber core.</figcaption>
            </motion.figure>

            <p>
              The wavelength that gets reflected—called the <strong>Bragg wavelength</strong>—is governed by the grating equation:
            </p>

            <motion.div
              className="equation-box"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <code>
                λ<sub>Bragg</sub> = 2n<sub>eff</sub>Λ
              </code>
              <br />
              <small>Where n<sub>eff</sub> is the effective refractive index, and Λ is the grating period.</small>
            </motion.div>

            <p>
              Any external change—like stretching the fiber or heating it—alters Λ or n<sub>eff</sub>, causing a shift in the reflected wavelength.
              This makes gratings incredibly sensitive sensors for strain and temperature.
            </p>

            <motion.figure
              className="media-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <img src={bragg} alt="Bragg Wavelength Shift" />
              <figcaption>Visualizing the Bragg wavelength shift with applied strain or temperature.</figcaption>
            </motion.figure>

            <h3 className="highlight-heading">Why Gratings Matter</h3>
            <ul className="grating-benefits">
              <motion.li whileHover={{ scale: 1.05 }}>🎯 Ultra-precise wavelength filtering</motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>🌡️ Accurate real-time strain & temperature sensing</motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>🔍 Tailorable reflection properties via design</motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>📦 Compact, passive, and immune to EMI</motion.li>
            </ul>

            <p>
              Fiber Bragg Gratings aren't just clever—they're critical. They transform optical fibers into <strong>smart sensors</strong>, adapting to and reporting on their environment with microscopic precision.
              Whether embedded into materials, wrapped around bridges, or laced through aircraft wings, their real value lies in their simplicity and elegance.
            </p>

            <motion.div
              className="call-to-action"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p><strong>Up Next:</strong> Discover how these gratings evolve across different materials and configurations in the "Taking the Model Further" section.</p>
            </motion.div>
          </motion.div>
        )}


        {/* Default Overview when "None" selected */}
        {activeTab === "" && <OverviewDefault />}
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  )
}

export default Explore


