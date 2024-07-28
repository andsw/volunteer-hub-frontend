import '../home/static/css/home.css'
import React from 'react';
import { useAccount } from '../../data/AccountProvider';

const About = () => {
    const { account } = useAccount();
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

            <div class="main-about">
                <div class="about-section">
                    <img src="../../assets/about1.png" alt="Our Story Image" />
                    <div>
                        <h2>Our Story</h2>
                        <p>
                            Our Volunteer Recruitment and Engagement Platform was founded with the vision of connecting passionate individuals with meaningful opportunities to give back to their communities. We believe that everyone has the potential to make a difference, and our platform is designed to make volunteering more accessible and impactful for all.
                        </p>
                        <p>
                            Since our inception, we have helped countless organizations and volunteers collaborate to achieve common goals. Whether it's supporting local initiatives, participating in global causes, or fostering a sense of community, our platform serves as a bridge between those who want to help and those who need it.
                        </p>
                    </div>
                </div>
                <div class="mission">
                    <div>
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to empower individuals and organizations to make a positive impact through volunteerism. We are committed to providing a seamless and user-friendly experience that makes it easy for volunteers to find opportunities that match their skills and interests, and for organizations to recruit and engage volunteers effectively.
                        </p>
                        <p>
                            We aim to build a strong, supportive community where volunteers feel valued and recognized for their contributions, and where organizations can achieve their goals with the help of dedicated and passionate individuals.
                        </p>
                    </div>
                    <img src="../../assets/about2.webp" alt="Our Mission Image" />
                </div>
                <div class="team">
                    <h2>Meet Our Team</h2>
                    <div class="team-members">
                        <div class="team-member">
                            <img src="../../assets/maleteammember.webp" alt="Team Member 1" />
                            <h3>Jane Doe</h3>
                            <p>Founder & CEO</p>
                        </div>
                        <div class="team-member">
                            <img src="../../assets/maleteammember.webp" alt="Team Member 2" />
                            <h3>John Smith</h3>
                            <p>Chief Operating Officer</p>
                        </div>
                        <div class="team-member">
                            <img src="../../assets/femaleteammember.jpg" alt="Team Member 3" />
                            <h3>Emily Johnson</h3>
                            <p>Director of Community Engagement</p>
                        </div>
                    </div>
                </div>
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

export default About;