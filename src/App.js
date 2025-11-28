import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>EnTrini</h1>
      </header>
      <main>
        <section className="hero">
          <h2>Welcome to EnTrini</h2>
          <p>Your premier destination for urban fitness and gym experiences.</p>
          <p>Currently partnered with 43 gyms.</p>
        </section>
        <section className="how-it-works">
          <h2>How EnTrini Works</h2>
          <p>EnTrini, the urban sports card for gyms</p>
          <p>Everything digital in the EnTrini app</p>
          <p>Flexible terms, no cancellation periods</p>
        </section>
        <section className="for-you">
          <h2>For You</h2>
          <p>Are you often travelling for business or pleasure? With the EnTrini, you'll never have to miss out on your fitness programme again.</p>
        </section>
        <section className="contact-gyms">
          <h2>Contact Us - For Gyms</h2>
          <p>If you would like to boost the revenues of your fitness studio, leisure centre, or your funicular or lift, but you want to retain your independence.</p>
          <p>Contact Us</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 EnTrini. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;