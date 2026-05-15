import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/apply');
  };

  return (
    <>
      <section className="hero">
        <h1>Welcome to HireHub</h1>
        <p>
          Join a company that values innovation, collaboration, and personal growth.
          At HireHub, we believe in building a culture where every team member can
          thrive and make a meaningful impact.
        </p>
        <button type="button" className="btn-primary" onClick={handleApplyClick}>
          Get Started
        </button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🚀 Innovation</h3>
          <p>
            We embrace cutting-edge technologies and encourage creative problem-solving.
            Every idea matters, and we empower our teams to push boundaries and build
            the future.
          </p>
        </div>
        <div className="feature-card">
          <h3>📈 Career Growth</h3>
          <p>
            Your growth is our priority. We offer mentorship programs, learning
            opportunities, and clear career paths to help you reach your full
            potential.
          </p>
        </div>
        <div className="feature-card">
          <h3>🤝 Great Culture</h3>
          <p>
            We foster an inclusive and supportive environment where diversity is
            celebrated. Collaboration, respect, and transparency are at the heart of
            everything we do.
          </p>
        </div>
        <div className="feature-card">
          <h3>🌍 Global Impact</h3>
          <p>
            Our work reaches millions of people worldwide. Join us in creating
            solutions that make a real difference in communities and industries
            across the globe.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>
          Take the first step toward an exciting career at HireHub. We can&apos;t wait
          to meet you and learn about what you bring to the team.
        </p>
        <button type="button" className="btn-primary" onClick={handleApplyClick}>
          Apply Now
        </button>
      </section>
    </>
  );
}