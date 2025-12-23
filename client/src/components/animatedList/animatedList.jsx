import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import './AnimatedList.css';

const AnimatedItem = ({ children, delay = 0, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.05 * (index % 5) }} 
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  renderItem,
  showGradients = true,
  className = '',
  displayScrollbar = true,
}) => {
  const listRef = useRef(null);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleScroll = useCallback(e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  return (
    <div className={`scroll-list-container ${className}`}>
      <div 
        ref={listRef} 
        className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`} 
        onScroll={handleScroll}
      >
        {items.map((item, index) => (
          <AnimatedItem key={item.id || index} index={index}>
             {renderItem(item, index)}
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;