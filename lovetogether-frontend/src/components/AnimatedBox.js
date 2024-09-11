import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function AnimatedBox() {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.to(boxRef.current, { rotation: 360, x: 100, duration: 2 });
  }, []);

  return (
    <div ref={boxRef} style={{ width: 100, height: 100, backgroundColor: 'purple' }}>
      Animated Box
    </div>
  );
}

export default AnimatedBox;