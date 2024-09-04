import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import { FaXTwitter } from "react-icons/fa6";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/alamsahjad849/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "12vmax", margin: "1vmax 0" }}
              src="https://res.cloudinary.com/dveabjyht/image/upload/v1725263505/personal/WhatsApp_Image_2024-04-25_at_22.54.41_3db16558_tltr0c.jpg"
              alt="Founder"
            />
            <Typography>Mohd Mahfooz Alam</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
            I'm a MERN stack developer with a focus on building efficient and secure eCommerce platforms. I create responsive interfaces, robust backend systems, and integrate key features like payment gateways and product management to deliver seamless online shopping experiences.            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://x.com/sahjadalam849"
              target="blank"
            >
              <FaXTwitter className="FaXTwittericon" />
            </a>

            <a href="https://www.instagram.com/alamsahjad849/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
