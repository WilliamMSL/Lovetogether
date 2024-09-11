import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';

function App() {
  useEffect(() => {
    gsap.registerPlugin(ScrollSmoother);

    ScrollSmoother.create({
      wrapper: '#wrapper', // L'élément qui enveloppe tout le contenu
      content: '#content', // L'élément qui contient tout le contenu à faire défiler
      smooth: 1.5, // Durée du lissage (plus grand = plus lisse)
      effects: true, // Activer les effets de scroll
    });
  }, []);

  return (
    <div id="wrapper" style={{ height: '100vh', overflow: 'hidden' }}>
      <div id="content">
        <section style={{ height: '100vh', backgroundColor: '#ff6347' }}>
          <h1>Section 1</h1>
        </section>
        <section style={{ height: '100vh', backgroundColor: '#4682b4' }}>
          <h1>Section 2</h1>
        </section>
        <section style={{ height: '100vh', backgroundColor: '#32cd32' }}>
          <h1>Section 3</h1>
        </section>
      </div>
    </div>
  );
}

export default App;