import './static/css/home.css'
import React, { useState } from 'react';
import { useAccount } from '../../data/AccountProvider';

const Home = () => {
    const {account} = useAccount();
    return (
        <div className="container">
            <section>
                <nav id="nav">
                    <div className="nav-content">
                        <div className="logo">
                            <img src="../../assets/logo.jpg" alt="Logo Image" />
                        </div>
                        <div className="nav-links">
                            <a href="/home">Home</a>
                            <a href="/about">About Us</a>
                            <a href="/contact">Contact Us</a>
                            {
                                account == null
                                ? <a href="/login">Login</a>
                                : <a href="/events">User Center</a>
                            }
                        </div>
                    </div>
                </nav>
            </section>

            <div className="bagroundImage">
                <h1>Volunteer Recruitment </h1>
                <h2> & Engagement Platform </h2>
            </div>
            <div className="message">
                <h1>Our Aim</h1>
                <blockquote><q>Volunteerism is one of the most selfless acts that we can become involved in. Nonprofits
                    around the world need more volunteers to carry out their missions and make the biggest difference
                    possible. Engage your volunteers and remember to demonstrate that their contributions make a big
                    difference.</q></blockquote>
            </div>
            <footer>
                <div className="footer-content">
                    <div className="quick-links">
                        <a href="#">Home</a>
                        <a href="#">About Us</a>
                        <a href="#">Contact Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div className="newsletter">
                        <h2>Newsletter Subscription</h2>
                        <input type="email" placeholder="Your Email" />
                        <button>Subscribe</button>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; 2024 @CopyrightVolunteerorg.com
                </div>
            </footer>
        </div>
    );
}

export default Home;