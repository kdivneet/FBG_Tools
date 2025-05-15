// JSX version without Tailwind
import React from 'react'
import './ExploreNavbar.css'
import { useNavigate } from 'react-router-dom'

const ExploreNavbar = () => {
  const navigate = useNavigate()

  return (
    <div className="explore-navbar">
      <div className="explore-logo">🔷 FBG Explorer</div>
      <button className="explore-btn" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button>
    </div>
  )
}

export default ExploreNavbar

