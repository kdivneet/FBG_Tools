import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'
import { Link } from 'react-router-dom'


const Hero = () => {
  return (
    <div className='hero container'>
    <div className='hero-text'>
        <h1>FBG-Simulator: Tools & Intelligent Assistant for Bragg Grating Applications</h1>
        <p>Fiber Bragg Grating (FBG) simulation made easy for researchers, students, and engineers.
Design custom FBGs, analyze their reflection spectra, and visualize results in real time.
A user-friendly tool to explore the fundamentals and applications of FBG technology.</p>
        <Link to="/explore">
          <button className='btn'>Explore More <img src={dark_arrow} alt='arrow' /></button>
        </Link>
    </div>

    </div>
  )
}

export default Hero