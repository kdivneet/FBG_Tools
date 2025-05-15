import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import menu_icon from '../../assets/menu-icon.png'
import fbg from '../../assets/fbg.png'
import l2 from '../../assets/l2.png'
import { Link } from 'react-scroll';


const Navbar = () => {

  const [sticky, setSticky] = useState(false);
  useEffect(()=>{
  
    window.addEventListener('scroll',()=>{
      window.scrollY > 50 ? setSticky(true) : setSticky(false);
    })

  },[]);

  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu=()=>{

    mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
       
  }

  return (
    <nav className= {`container ${sticky ? 'dark-nav': '' }`}>
        <img src={logo} className='logo'></img>
        <ul className={mobileMenu? '':'hide-mobile-menu'}>
         
            <li><Link to='hero' smooth={true} offset={0} duration={500}>Home</Link></li>
            <li><Link to='program' smooth={true} offset={-260} duration={500}>Working</Link></li>
            <li><Link to='about' smooth={true} offset={-150} duration={500}>Coherence Length</Link></li>
            <li><Link to='FWHM' smooth={true} offset={-150} duration={500}>FWHM Calculator</Link></li>
            <li><Link to='campus' smooth={true} offset={-260} duration={500}>Facts</Link></li>
            <li><Link to='testimonals' smooth={true} offset={-260} duration={500}>User Feedbacks</Link></li>
            <li><Link to='contact' smooth={true} offset={-260} duration={500}><button className='btn'>Contact Us</button></Link></li> 
        </ul>
      
      <img src={menu_icon} className='menu-icon' onClick={toggleMenu}></img>

    </nav>
  )
}

export default Navbar