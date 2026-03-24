import { useMemo } from 'react';

const MarqueeBanner = ({ items, speed = 30 }) => {
  const marqueeItems = useMemo(() => items.map((item, index) => (
    <span key={index} className="marquee-item">
      {item.icon && <i className={item.icon}></i>}
      {item.text}
    </span>
  )), [items]);

  return (
    <section className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-content" style={{ animationDuration: `${speed}s` }}>
          {marqueeItems}
          {marqueeItems}
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
