import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Heart, HelpingHand, MapPin, Mail, Phone, X, Menu, Settings, Globe } from 'lucide-react';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2F6ZFLkb7NWWZTRxLdbyZaFo8AWFJ2%2FSocialGivingLogo2__906394ff.jpg?alt=media&token=a358df57-de40-4ece-8bd3-b08215189b27';
const HERO_BG = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop';
const BLINK_BADGE = 'https://blink.new/badge.svg';

// === Components ===

const DonateModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = ['10', '25', '50', '100'];

  const handlePayment = async () => {
    try {
      setLoading(true);
      const donationAmount = customAmount || amount;
      if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
        alert('Please enter a valid amount');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(donationAmount) }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment failure: ' + (data.error || 'Check server connection'));
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to payment server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close" disabled={loading}>
          <X size={24} />
        </button>
        
        <h2 className="text-center mb-4">Make a Donation</h2>
        <p className="text-center mb-8" style={{ color: '#666' }}>Your contribution helps us create meaningful impact in our community.</p>

        <div className="donation-amounts">
          {presetAmounts.map(val => (
            <button
              key={val}
              className={`amount-btn ${amount === val && !customAmount ? 'selected' : ''}`}
              onClick={() => { setAmount(val); setCustomAmount(''); }}
              disabled={loading}
            >
              ${val}
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <span className="custom-amount-prefix">$</span>
          <input 
            type="number" 
            className="custom-amount-input" 
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount('');
            }}
            disabled={loading}
          />
        </div>

        <button 
          className="btn btn-accent" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.25rem' }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  );
};

const Header = ({ onDonateClick }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={LOGO_URL} alt="Social Giving Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
          Social Giving
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
          <Link to="/volunteer" className={`nav-link ${isActive('/volunteer')}`}>Volunteer</Link>
          <Link to="/how-it-works" className={`nav-link ${isActive('/how-it-works')}`}>How It Works</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact Us</Link>
        </nav>
        
        <div className="header-actions">
          <a href="#" className="login-link">Login</a>
          <button className="btn btn-primary">Join Us</button>
          <button className="btn btn-accent" onClick={onDonateClick}>Donate</button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo mb-4" style={{ color: 'white' }}>
              <img src={LOGO_URL} alt="Social Giving Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
              Social Giving Hub
            </Link>
            <p style={{ marginTop: '1rem' }}>Empowering real actions that drive meaningful community change. Join the movement of collective generosity.</p>
          </div>
          
          <div>
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/volunteer" className="footer-link">Volunteer</Link>
              <Link to="/how-it-works" className="footer-link">How It Works</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
          </div>
          
          <div>
            <h3>Contact Info</h3>
            <div className="footer-links">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <MapPin size={18} className="logo-icon" />
                <span>71 London Street, Hamilton Central, NZ</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={18} className="logo-icon" />
                <span>hello@socialgivinghub.org</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={18} className="logo-icon" />
                <span>+64 123 456 789</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Social Giving Hub. All rights reserved.</p>
          <div className="watermark">
            <img src={BLINK_BADGE} alt="Made with Blink" style={{ height: '24px' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};


// === Pages ===

const Home = ({ onDonateClick }) => {
  useEffect(() => {
    // Check if we returned from stripe checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      alert("Donation successful! Thank you for your kindness.");
    }
    if (urlParams.get('canceled')) {
      alert("Donation canceled. You can try again whenever you're ready.");
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="hero" style={{ 
        backgroundImage: `linear-gradient(rgba(26, 77, 46, 0.8), rgba(26, 77, 46, 0.9)), url(${HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white'
      }}>
        <div className="container">
          <div className="hero-content">
            <div className="pill" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>Launch Event: Tuesday May 5</div>
            <h1 className="hero-title" style={{ color: 'white' }}>Collective Kindness</h1>
            <p className="hero-subtitle" style={{ color: '#eee' }}>
              We empower real actions that drive meaningful community change. 
              Join the movement of collective generosity.
            </p>
            <div className="hero-actions">
              <button className="btn btn-accent" onClick={onDonateClick} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Start Giving</button>
              <Link to="/how-it-works" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem', backgroundColor: 'transparent', border: '2px solid white', color: 'white' }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="partners">
        <div className="container">
          <h3 className="text-center" style={{ color: '#888', fontFamily: 'var(--font-sans)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Partners & Sponsors</h3>
          <div className="partners-grid">
            <div className="partner-logo">NZ Business Connect</div>
            <div className="partner-logo">Media PA</div>
            <div className="partner-logo">Foley Douglas</div>
            <div className="partner-logo">Maisey Harris & Co.</div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <h2 className="text-center mb-8" style={{ fontSize: '2.5rem' }}>Our Impact Focus</h2>
          <div className="grid grid-cols-3">
            <div className="card text-center">
              <div className="card-icon" style={{ margin: '0 auto 1.5rem' }}>
                <Heart size={28} />
              </div>
              <h3>Community Needs</h3>
              <p>Directing funds to where they make the most immediate impact in our local communities.</p>
            </div>
            <div className="card text-center">
              <div className="card-icon" style={{ margin: '0 auto 1.5rem' }}>
                <HelpingHand size={28} />
              </div>
              <h3>Volunteer Action</h3>
              <p>Mobilizing passionate individuals to lend their time and skills to worthy causes.</p>
            </div>
            <div className="card text-center">
              <div className="card-icon" style={{ margin: '0 auto 1.5rem' }}>
                <Globe size={28} />
              </div>
              <h3>Global Relief</h3>
              <p>Extending our reach to support international aid efforts during critical times.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const About = () => {
  return (
    <div className="animate-fade-in py-16">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem' }}>About Social Giving Hub</h1>
          
          <div className="card mb-8">
            <h2>Our Mission</h2>
            <p>
              We are dedicated to transforming community support by connecting individuals and organizations 
              with meaningful causes. Our platform provides the transparency and tools needed to foster a 
              culture of collective generosity.
            </p>
          </div>

          <div className="grid grid-cols-2 mb-8">
            <div className="card">
              <h3>Core Activities</h3>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Connecting compassionate individuals to trusted causes.</li>
                <li style={{ marginBottom: '0.5rem' }}>Providing transparent donation tracking.</li>
                <li style={{ marginBottom: '0.5rem' }}>Fostering resilient, supportive local communities.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Our Vision</h3>
              <p>
                A world where collective kindness is seamlessly integrated into daily life, creating 
                resilient communities equipped to support each other through transparent giving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Volunteer = () => {
  return (
    <div className="animate-fade-in py-16" style={{ backgroundColor: 'var(--bg-gray)' }}>
      <div className="container">
        <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>Join as a Volunteer</h1>
        <p className="text-center mb-8" style={{ color: '#666', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Your time and skills can make a massive difference. Apply today to become a part of our growing community of changemakers.
        </p>

        <div className="form-container">
          <form onSubmit={(e) => { e.preventDefault(); alert('Application Submitted!'); }}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder="John" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder="Doe" required />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="john@example.com" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" placeholder="+64 123 456 789" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Area of Interest</label>
              <select className="form-control" required>
                <option value="">Select an area...</option>
                <option value="events">Event Coordination</option>
                <option value="fundraising">Fundraising</option>
                <option value="admin">Administrative Support</option>
                <option value="community">Community Outreach</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message (Optional)</label>
              <textarea className="form-control" placeholder="Tell us a bit about why you want to volunteer..."></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="animate-fade-in py-16">
      <div className="container">
        <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '3rem' }}>How It Works</h1>
        
        <div className="grid grid-cols-3">
          <div className="card text-center" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-color)', color: 'white', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
            <div className="card-icon" style={{ margin: '1.5rem auto 1.5rem' }}>
              <Globe size={28} />
            </div>
            <h3>Connect</h3>
            <p>We create meaningful connections between passionate individuals, businesses, and trusted local causes.</p>
          </div>
          
          <div className="card text-center" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-color)', color: 'white', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
            <div className="card-icon" style={{ margin: '1.5rem auto 1.5rem' }}>
              <Heart size={28} />
            </div>
            <h3>Fund</h3>
            <p>Through transparent and secure donation processes, we aggregate funds to maximize impact.</p>
          </div>
          
          <div className="card text-center" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-color)', color: 'white', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
            <div className="card-icon" style={{ margin: '1.5rem auto 1.5rem' }}>
              <HelpingHand size={28} />
            </div>
            <h3>Impact</h3>
            <p>Watch your collective kindness grow as funds are deployed to drive meaningful, measurable community change.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="animate-fade-in py-16" style={{ backgroundColor: 'var(--bg-gray)' }}>
      <div className="container">
        <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '3rem' }}>Contact Us</h1>
        
        <div className="grid grid-cols-2">
          <div>
            <div className="card mb-8">
              <h3>Get in Touch</h3>
              <p className="mb-4">We'd love to hear from you. Reach out with any questions, or just to say hello.</p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <MapPin size={24} className="logo-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)' }}>Our Office</h4>
                  <p style={{ color: '#666' }}>71 London Street<br/>Hamilton Central, NZ</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <Mail size={24} className="logo-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)' }}>Email</h4>
                  <p style={{ color: '#666' }}>hello@socialgivinghub.org</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3>Key Contacts</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}><strong>Phillip Quay</strong> - Director</li>
                <li style={{ padding: '0.75rem 0' }}><strong>Fiona</strong> - Community Manager</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="form-container" style={{ margin: 0, width: '100%' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Jane Doe" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="jane@example.com" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-control" placeholder="How can we help?" />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" placeholder="Your message here..." required></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// === App Root ===

function App() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Header onDonateClick={() => setIsDonateModalOpen(true)} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home onDonateClick={() => setIsDonateModalOpen(true)} />} />
            <Route path="/about" element={<About />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        <Footer />
        
        <DonateModal 
          isOpen={isDonateModalOpen} 
          onClose={() => setIsDonateModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
