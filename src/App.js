import './App.css';

import React, { useState, useEffect, useRef } from 'react';

import logo from './images/ic_appstr_brand_logo.svg'; 
 

// 000080 : dark_blue
// 2a7fff : light_blue
// 5fbcd3 : cyanish
// 5fd3bc : tealish
// ffdd55 : yellow
// ff9955 : orange
// ff80b2 : pink
// fc3c3c : red



function Worksite() {
  return (
      <div className="main-container">
        <SuperBackground/>
        <ToolsTicker/>
        <BrandArea/>
        <ContentArea/>
      </div>
  );
}

function SuperBackground() {
  return (
    <div className="super-background">
      
    </div>
  );
}

function ToolsTicker() {
  const toolsUsedText = "React, Google Cloud Platform(GCP), Helm, Kubernetes, Docker, Nginx, GraphQL(coming soon), PostgreSQL(coming soon), Kotlin/Compose/etc on Android, and more..."
  
  const [tickerWidth, setTickerWidth] = useState(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const tickerElement = tickerRef.current;
    setTickerWidth(tickerElement.clientWidth);
  }, [toolsUsedText]);

  return (
    <div className="tools-ticker" ref={tickerRef}>
      <span className="tools-ticker-text">{toolsUsedText}</span>
    </div>
  );
}

function ToolbarTabLabel() {
  return (
    <div>

    </div>
  );
}

function ToolbarIndicator() {
  return (
    <div>

    </div>
  );
}

function BrandArea() {
  return (
    <div className="brand-area">
      <span className="brand-label">AppStr</span>
      <button className="brand-button">
        <img className="brand-icon" src={logo}  alt="Logo" width="32" height="32"  viewBox="0 0 100 100"/>

      </button>
    </div>
  );
}

function ContentArea() {
  const maxTransY = 200
  const [translationY, setTranslationY] = useState(0);
  var transYContentArea = translationY
  
  const onWheel = (event) => {
    transYContentArea = transYContentArea + event.deltaY
    
    if (transYContentArea > 0){
      transYContentArea = Math.min(transYContentArea, maxTransY);
    }else{
      transYContentArea = Math.max(transYContentArea, 0);
    }

    setTranslationY(transYContentArea);
  };

  useEffect(() => {
    document.addEventListener('wheel', onWheel);
    return () => document.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="content-area" style={{ transform: `translateY(${translationY}px)` }}>
        {/* <p>Number of fingers: {touches.length}</p> */}
    </div>
  );
}

 
export default Worksite;
