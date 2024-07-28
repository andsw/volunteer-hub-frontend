import '../home/static/css/home.css'
import React from 'react';
import { useAccount } from '../../data/AccountProvider';

const ContactUs = () => {
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

            <div class="main-content-wrapper">
                <div class="main-contact">
                    <div class="top_bar">
                        <h1>Contact Us</h1>
                        <p>We're here to help you with any questions or support you need.</p>
                    </div>
                    <div class="contact-form">
                        <form>
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required />
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required />
                            <label for="phone">Phone Number (Optional)</label>
                            <input type="tel" id="phone" name="phone" />
                            <label for="role">Role</label>
                            <select id="role" name="role" required>
                                <option value="volunteer">Volunteer</option>
                                <option value="activity-host">Activity Host</option>
                                <option value="admin">Admin</option>
                                <option value="other">Other</option>
                            </select>
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required />
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                            <button type="submit">Send Message</button>
                            <div class="support-info">
                                <h2>Support Information</h2>
                                <p>Email: support@volunteerplatform.com</p>
                                <p>Phone: +1-800-123-4567</p>
                                <p>Office Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
                            </div>
                            <div class="location">
                                <h2>Location</h2>
                                <p>Volunteer Recruitment & Engagement Platform</p>
                                <p>123 Community Lane</p>
                                <p>City, State, ZIP Code</p>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509172!2d144.9559283153189!3d-37.81720997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f8f3f7%3A0x2e2b17e8bca8e4b1!2s123%20Community%20Lane%2C%20City%2C%20State%2C%20ZIP%20Code!5e0!3m2!1sen!2s!4v1624264545081!5m2!1sen!2s"
                                    allowfullscreen="" loading="lazy"></iframe>
                            </div>

                            <div class="community-forums">
                                <h2>Community Forums</h2>
                                <p>Join our community forums to connect with other volunteers and hosts.</p>
                                <a href="forums.html"><button>Join Community</button></a>
                            </div>

                            <div class="social-media">
                                <h2>Follow Us</h2>
                                <a href="#"><img src="../../assets/facebook.jpg" alt="Facebook" /></a>
                                <a href="#"><img src="../../assets/twitter.png" alt="Twitter" /></a>
                                <a href="#"><img src="../../assets/instagram.png" alt="Instagram" /></a>
                                <a href="#"><img src="../../assets/linkedin.png" alt="LinkedIn" /></a>
                            </div>
                        </form>
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
        </div >
    );
}

export default ContactUs;