import React from 'react'
import './Campus.css'
import gallery_1 from '../../assets/gallery-1.png'
import gallery_2 from '../../assets/gallery-2.png'
import gallery_3 from '../../assets/gallery-3.png'
import gallery_4 from '../../assets/gallery-4.png'
import white_arrow from '../../assets/white-arrow.png'
import fbg2 from '../../assets/FBG2.png'
import fbg3 from '../../assets/FBG3.png'
import fbg4 from '../../assets/FBG4.png'
import fbg5 from '../../assets/FBG5.png'
import { Link } from 'react-router-dom';

const Campus = () => {
  return (
    <div className='campus'>
    <div className='gallery'>
        <img src={fbg2}></img>
        <img src={fbg3}></img>
        <img src={fbg4}></img>
        <img src={fbg5}></img>
    </div>
    <Link to="/explore-facts">
  <button className='btn dark-btn'>See more here</button>
</Link>
    </div>
  )
}

export default Campus