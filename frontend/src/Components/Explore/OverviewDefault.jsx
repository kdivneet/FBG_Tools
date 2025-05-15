import React from 'react';
import './OverviewDefault.css';
import fbbg from '../../assets/fbbbg.png';
import applications from '../../assets/applications.png';
import { motion } from 'framer-motion';

const OverviewDefault = () => {
  return (
    <div className="overview-default">
      <motion.section
        id="overview"
        className="overview-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🔍 What is a Fiber Bragg Grating?</h2>
        <p>
          An FBG is a segment of an optical fiber where the refractive index is periodically varied. These variations reflect specific wavelengths while transmitting others. This fundamental property enables their use as optical filters and sensors. It is a remarkable innovation in the world of optical sensing—essentially a finely tuned mirror etched inside an optical fiber. Within a small segment of the fiber, the refractive index is periodically altered, forming a microscopic pattern that reflects specific wavelengths of light while allowing others to pass through.
        </p>
        <p>
          This selective reflection isn’t just a neat optical trick—it forms the basis for highly accurate sensing. FBGs act like spectral gatekeepers, responding to changes in temperature, strain, pressure, or vibration by shifting the wavelength of the reflected light. This makes them incredibly valuable in diverse applications—from monitoring the stability of bridges and slopes, to ensuring the safety of aircraft structures, to even tracking biological signals in medical settings. Compact, passive, and immune to electromagnetic interference, FBGs transform ordinary optical fibers into intelligent sensing systems, offering real-time insights with impressive precision and reliability. In essence, they are the silent sentinels of modern engineering, turning beams of light into powerful diagnostic tools.
        </p>
        <img src={fbbg} alt="FBG Structure" className="styled-img" />
        <figcaption>Fig: Schematic of a Fiber Bragg Grating showing periodic index modulation.</figcaption>
      </motion.section>

      <motion.section
        id="working"
        className="overview-section"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🧠 How Does It Work?</h2>
        <p>
          When light travels through an FBG, only a specific wavelength—the Bragg wavelength—is reflected. This reflection is highly sensitive to strain and temperature changes, making FBGs ideal for environmental and structural monitoring.
        </p>
        <video controls src="/videos/bragg_reflection.mp4" className="styled-video" />
        <figcaption>Bragg reflection visualized: Only a narrow band of light is reflected.</figcaption>
        <p>
          Instead of simply passing through the optical fiber uninterrupted, part of the light is selectively reflected. This occurs because the FBG contains a periodic modulation of the refractive index within the fiber core, forming a structure that behaves like a wavelength-specific mirror. Only a particular wavelength of light—known as the Bragg wavelength—is reflected, while all others continue to propagate through the fiber.
        </p>
        <p>
          What makes this even more fascinating is that the Bragg wavelength is highly sensitive to changes in the surrounding environment. When the fiber experiences mechanical strain or temperature variations, the spacing and refractive index of the grating subtly change. As a result, the reflected wavelength shifts. By accurately measuring this shift, one can determine the precise amount of strain or temperature change affecting the fiber.
        </p>
        <p>
          This sensitivity enables FBGs to serve as highly effective sensors in a variety of fields, including structural health monitoring, aerospace engineering, biomedical diagnostics, and energy systems. Whether embedded in bridges to detect stress, integrated into aircraft wings to monitor deformation, or used in medical devices to track physiological changes, FBGs provide real-time, reliable data without the need for bulky equipment or electrical power sources. Their ability to convert physical changes into readable optical signals makes them an essential tool in modern sensing technology.
        </p>
      </motion.section>

      <motion.section
        id="applications"
        className="overview-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🌍 Real-World Applications</h2>
        <p>FBGs are used in a wide range of industries:</p>
        <ul className="fancy-list">
          <li><strong>Civil Engineering:</strong> For monitoring bridges and tunnels.</li>
          <li><strong>Biomedical:</strong> Measuring pressure and temperature in catheters.</li>
          <li><strong>Aerospace:</strong> Detecting strain on aircraft wings.</li>
          <li><strong>Energy:</strong> Monitoring temperature in power grids and wind turbines.</li>
        </ul>
        <p>
          Fiber Bragg Gratings (FBGs) have found a home in a wide range of industries, thanks to their precision, durability, and ability to operate in harsh environments. In civil engineering, FBG sensors are embedded in critical structures such as bridges, tunnels, dams, and slopes to continuously monitor strain, stress, displacement, and temperature. This real-time data helps engineers detect early signs of structural fatigue or failure, enabling timely maintenance and preventing disasters.
        </p>
        <p>
          In the biomedical field, FBGs are integrated into catheters and surgical tools to measure internal body temperature, blood pressure, and respiratory signals with high accuracy and minimal invasiveness. Their biocompatibility and immunity to electromagnetic interference make them especially useful in sensitive environments like MRI machines.
        </p>
        <p>
          In aerospace engineering, FBGs play a crucial role in monitoring strain, load, and vibration on aircraft components such as wings, fuselage, and turbine blades. They help ensure structural integrity during flight, contributing to safety and performance optimization. Meanwhile, in the energy sector, FBGs are widely used to monitor temperature, pressure, and mechanical stress in high-voltage power lines, transformers, and wind turbines. They provide critical insights for maintaining energy efficiency, detecting potential faults, and preventing system failures.
        </p>
        <img src={applications} alt="Applications" className="styled-img" />
        <figcaption>Fig: Real-world uses of FBG fiber sensors in engineering, aerospace, biomedicine, and energy systems.</figcaption>
      </motion.section>

      <motion.section
        id="advantages"
        className="overview-section"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🎯 Advantages of FBG Sensors</h2>
        <ul className="fancy-list">
          <li>✅ Immune to electromagnetic interference (EMI)</li>
          <li>✅ Lightweight and compact</li>
          <li>✅ Multiplexing capability (multiple sensors in one fiber)</li>
          <li>✅ Long-term stability and durability</li>
          <li>✅ Remote sensing over long distances</li>
        </ul>
      </motion.section>

      <motion.section
        id="need"
        className="overview-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🤔 Why Should You Care?</h2>
        <p>
          Understanding Fiber Bragg Gratings (FBGs) opens up a world of possibilities for anyone involved in fields such as optical engineering, telecommunications, or sensor development. By grasping how FBGs work, you can tap into their potential to design cutting-edge sensors capable of monitoring everything from structural health to biological parameters with incredible precision.
        </p>
        <p>
          You can also delve into creating sophisticated optical filters that selectively manipulate light for applications in telecommunications, improving data transmission speeds and enhancing signal quality. Moreover, FBG technology is a gateway to innovation in smart materials, enabling real-time monitoring and diagnostics in a wide range of industries.
        </p>
        <p>
          Whether you're a student looking to expand your knowledge or a professional seeking to enhance your toolkit, exploring FBGs offers a unique opportunity to harness the power of light in solving complex real-world problems, making it a technology that's both practical and forward-thinking.
        </p>
        <blockquote className="highlight-quote">⚠️ FBGs are extremely sensitive to micrometer-level strain!</blockquote>
      </motion.section>

      <motion.section
        className="overview-section bonus"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="animated-heading">🚀 Explore Further</h2>
        <ul className="fancy-list">
          <li>📘 <a href="#fbg-theory">FBG Theory Guide</a></li>
          <li>🔧 <a href="#interactive-builder">Interactive Builder Tool</a> (coming soon)</li>
          <li>📁 <a href="#download-files">Download Simulation Files</a></li>
        </ul>
      </motion.section>
    </div>
  );
};

export default OverviewDefault;

