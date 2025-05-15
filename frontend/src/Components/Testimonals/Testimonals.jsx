import React , {useRef} from 'react'
import './Testimonals.css'
import next_icon from '../../assets/next-icon.png'
import back_icon from '../../assets/back-icon.png'
import user_1 from '../../assets/user-1.png'
import user_2 from '../../assets/user-3.png'
import user_3 from '../../assets/user-3.png'
import user_4 from '../../assets/user-4.png'


const Testimonals = () => {
    const slider= useRef();
    let tx=0;

    const slideForward = () => {

        if(tx>-50){
            tx -=25;
        }
        slider.current.style.transform = `translateX(${tx}%)`;

    }
    const slideBackward = () => {
     
        if(tx< 0){
            tx +=25;
        }
        slider.current.style.transform = `translateX(${tx}%)`;
       

    }

  return (
    <div className='testimonals'>
       <img src={next_icon} className='next-btn' onClick={slideForward} ></img>
       <img src={back_icon} className='back-btn' onClick={slideBackward}></img>
       <div className='slider'>
        <ul ref={slider}>
            <li>
                <div className='slide'>
                    <div className='user-infp'>
                        <img src={user_1}></img>
                        <div>
                            <h3>William Jackson</h3>
                            <span>Edusity, USA</span>
                        </div>
                    </div>
                    <p>The Lorentzian function I provided ensures that the reflectivity values stay within the 0 to 1 range, especially when using np.clip() to handle noise variations.</p>
                </div>
            </li>
            <li>
                <div className='slide'>
                    <div className='user-infp'>
                        <img src={user_2}></img>
                        <div>
                            <h3>William Jackson</h3>
                            <span>Edusity, USA</span>
                        </div>
                    </div>
                    <p>The Lorentzian function I provided ensures that the reflectivity values stay within the 0 to 1 range, especially when using np.clip() to handle noise variations.</p>
                </div>
            </li>
            <li>
                <div className='slide'>
                    <div className='user-infp'>
                        <img src={user_3}></img>
                        <div>
                            <h3>William Jackson</h3>
                            <span>Edusity, USA</span>
                        </div>
                    </div>
                    <p>The Lorentzian function I provided ensures that the reflectivity values stay within the 0 to 1 range, especially when using np.clip() to handle noise variations.</p>
                </div>
            </li>
            <li>
                <div className='slide'>
                    <div className='user-infp'>
                        <img src={user_4}></img>
                        <div>
                            <h3>William Jackson</h3>
                            <span>Edusity, USA</span>
                        </div>
                    </div>
                    <p>The Lorentzian function I provided ensures that the reflectivity values stay within the 0 to 1 range, especially when using np.clip() to handle noise variations.</p>
                </div>
            </li>
        </ul>
       </div>
    </div>
  )
}

export default Testimonals