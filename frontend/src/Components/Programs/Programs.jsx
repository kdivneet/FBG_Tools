import React from 'react'
import './Programs.css'
import program1 from '../../assets/program-1.png'
import program2 from '../../assets/program-2.png'
import program3 from '../../assets/program-3.png'
import program4 from '../../assets/prog2.png'
import program5 from '../../assets/prog3.png'
import img1 from '../../assets/img1.png'
import img2 from '../../assets/img2.png'
import img4 from '../../assets/img4.png'
import program_icon_1 from '../../assets/program-icon-1.png'
import program_icon_2 from '../../assets/program-icon-2.png'
import program_icon_3 from '../../assets/program-icon-3.png'

const Programs = () => {
  return (
    <div className='programs'>
    <div className='program'>
        <img src={img1}></img>
        
    </div>
    <div className='program'>
        <img src={img2}></img>
        {/* <div className='caption'>
            <img src={program_icon_2}></img>
            <p>FBG Reflections</p>
        </div> */}
    </div>
    <div className='program'> 
        <img src={img4}></img>
        {/* <div className='caption'>
            <img src={program_icon_3}></img>
            <p>Factors Affected</p>
        </div> */}
    </div>
    </div>
  )
}

export default Programs