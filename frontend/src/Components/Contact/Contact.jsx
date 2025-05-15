import React from 'react'
import './Contact.css'
import msg_icon from '../../assets/msg-icon.png'
import mail_icon from '../../assets/mail-icon.png'
import phone_icon from '../../assets/phone-icon.png'
import location_icon from '../../assets/location-icon.png'
import white_arrow from '../../assets/white-arrow.png'


const Contact = () => {


    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "89caf9e7-b6e2-40b1-89b1-8beaea9da66c");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
      
    } else {
      console.log("Error", data);
      setResult(data.message);
    }};

  return (
    <div className='contact'>
       
       <div className='contact-col'>
        <h3>Send us a message<img src={msg_icon}></img> </h3>
        <p>We’d love to hear from you! Share your valuable feedback, suggestions, or any questions you may have. Your input helps us improve and serve you better.</p>
        <ul>
            <li><img src={mail_icon}></img> fbggratings@gmail.com</li>
            <li><img src={phone_icon}></img>+91**********</li>
        </ul>
       </div>
       <div className='contact-col'>
        <form onSubmit={onSubmit}>
            <label>Your Name:</label>
            <input type='text' name='name' placeholder='Enter your name' required></input>
            <label>Telephone:</label>
            <input type='tel' name='phone' placeholder='Enter your mobile number' required></input>
            <label>Write your message here</label>
            <textarea name='message' id=''  rows='6' placeholder='Enter your message here' required ></textarea>
            <button type='submit' className='btn dark-btn'>Submit Now<img src={white_arrow}></img> </button>
        </form>
        <span>{result}</span>
       </div>

    </div>
  )
}

export default Contact