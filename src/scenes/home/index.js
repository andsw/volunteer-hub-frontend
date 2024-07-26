import './static/css/home.css'

const Home = () => {
    return (
        <div class="container">
            <section>
                <nav id="nav">
                    <div class="nav-content">
                        <div class="logo">
                            <img src="../../assets/logo.jpg" alt="Logo Image"/>
                        </div>
                        <div class="nav-links">
                            <a href="/home">Home</a>
                            <a href="/about">About Us</a>
                            <a href="/events">Events</a>
                            <a href="/contact">Contact Us</a>
                            <a href="/login">Login</a>
                        </div>
                    </div>
                </nav>
            </section>

            <div class="bagroundImage">
                <p>
                    <h1>Volunteer Recruitment </h1>
                </p>
                <p>
                    <h2> & Engagement Platform </h2>
                </p>
            </div>
            <div class="message">

                <h1>Our Aim</h1>
                <p><blockquote><q>Volunteerism is one of the most selfless acts that we can become involved in. Nonprofits
                    around the world need more volunteers to carry out their missions and make the biggest difference
                    possible. Engage your volunteers and remember to demonstrate that their contributions make a big
                    difference.</q></blockquote></p>
            </div>
            <footer>
                <div class="footer-content">
                    <div class="quick-links">
                        <a href="#">Home</a>
                        <a href="#">About Us</a>
                        <a href="#">Contact Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div class="newsletter">
                        <h2>Newsletter Subscription</h2>
                        <input type="email" placeholder="Your Email" />
                        <button>Subscribe</button>
                    </div>
                </div>
                <div class="footer-bottom">
                    &copy; 2024 @CopyrightVolunteerorg.com
                </div>
            </footer>
        </div>);
}

export default Home;