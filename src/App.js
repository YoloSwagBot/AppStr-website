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
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [screenHeight, setHeight] = useState(window.innerHeight);
  console.log("initial_dimensions: " + screenWidth + ", " + screenHeight);
  const isMobileWidth = screenWidth < 481;
  const isSmallScreen = !isMobileWidth && screenWidth < 1025;
  // const isLargerScreen = !isMobileWidth && !isSmallScreen;
  useEffect(() => {
    const handleResize = () => {
      console.log("ON_RESIZE_EVENT: w: " + window.innerWidth + "    h: " + window.innerHeight);
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      console.log("ON_RESIZE_EVENT: screenWidth: " + screenWidth + "    screenHeight: " + screenHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  var tickerHeight = 16;
  var toolbarHeight = 64;
  var contentAreaMinCorners = 24;
  var contentAreaMaxCorners = 48;
  var contentAreaMinSideMargin = 32;
  var contentAreaMaxSideMargin = 64
  if (isMobileWidth){
    tickerHeight = 16;
    toolbarHeight = 64;
    contentAreaMinCorners = 16;
    contentAreaMaxCorners = 32;
    contentAreaMinSideMargin = 16;
    contentAreaMaxSideMargin = 32
  }else if(isSmallScreen){
    tickerHeight = 20;
    toolbarHeight = 80;
    contentAreaMinCorners = 32;
    contentAreaMaxCorners = 80;
    contentAreaMinSideMargin = 56;
    contentAreaMaxSideMargin = 98;
  }else{ // isLargerScreen
    tickerHeight = 20;
    toolbarHeight = 80;
    contentAreaMinCorners = 32;
    contentAreaMaxCorners = 96;
    contentAreaMinSideMargin = 64;
    contentAreaMaxSideMargin = 128;
  }
  const contentAreaHeight = screenHeight - toolbarHeight - tickerHeight;

  var contentAreaMaxTransY = contentAreaHeight - contentAreaMaxCorners;
  const [translationY, setTranslationY] = useState(0);
  var contentAreaTransY = translationY
  const onWheel = (event) => {
    contentAreaTransY = contentAreaTransY + event.deltaY;
    contentAreaTransY = Math.min(Math.max(contentAreaTransY, 0), contentAreaMaxTransY);
    setTranslationY(contentAreaTransY);
  };
  useEffect(() => {
    document.addEventListener('wheel', onWheel);
    return () => document.removeEventListener('wheel', onWheel);
  }, []);

  return (
      <div className="main-container">
        <SuperBackground/>
        <ToolsTicker
          tickerHeight={tickerHeight}
          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}
          contentAreaMinSideMargin={contentAreaMinSideMargin} />
        <BrandArea/>
        <ContentArea
          screenWidth={screenWidth}
          screenHeight={screenHeight}

          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}

          contentAreaHeight={contentAreaHeight}
          contentAreaMinCorners={contentAreaMinCorners} 
          contentAreaMaxCorners={contentAreaMaxCorners} 
          contentAreaMinSideMargin={contentAreaMinSideMargin}
          contentAreaMaxSideMargin={contentAreaMaxSideMargin} />
      </div>
  );
}

function SuperBackground() {
  return (
    <div className="super-background">
      
    </div>
  );
}

function ToolsTicker(
  { tickerHeight,
    contentAreaTransY,
    contentAreaMaxTransY,
    contentAreaMinSideMargin }
) {
  // max ticker transY is (-1 * tickerHeight)
  var toolsTickerTransY = -1 * ((contentAreaTransY * (tickerHeight - 0)) / ((contentAreaMaxTransY/2) - 0));
  console.log("toolsTickerTransY: " + toolsTickerTransY);

  const toolsUsedText = "React, Google Cloud Platform(GCP), Helm, Kubernetes, Docker, Nginx, GraphQL(coming soon), PostgreSQL(coming soon), Kotlin/Compose/etc on Android, and more...";
  return (
    <div className="tools-ticker"
      style={{
        transform: `translateY(${toolsTickerTransY}px)`,
        left: `${contentAreaMinSideMargin}px`,
        right: `${contentAreaMinSideMargin}px`
      }}>
        <div className="tools-ticker-text">
            {toolsUsedText}
        </div>
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

function ContentArea(
  { screenWidth, 
    screenHeight, 
    
    contentAreaTransY,
    contentAreaMaxTransY,

    contentAreaHeight, 
    contentAreaMinCorners, 
    contentAreaMaxCorners,
    contentAreaMinSideMargin,
    contentAreaMaxSideMargin }
) {

  var currentCornerSize = ((contentAreaTransY * (contentAreaMaxCorners - contentAreaMinCorners)) / (contentAreaMaxTransY - 0)) + contentAreaMinCorners;
  var currentSizeMargin = ((contentAreaTransY * (contentAreaMaxSideMargin - contentAreaMinSideMargin)) / (contentAreaMaxTransY - 0)) + contentAreaMinSideMargin;
  return (
    <div className="content-area" style={
      {
        transform: `translateY(${contentAreaTransY}px)`,
        borderTopLeftRadius: `${currentCornerSize}px`,
        borderTopRightRadius: `${currentCornerSize}px`,
        left: `${currentSizeMargin}px`,
        right: `${currentSizeMargin}px`
      }
    }>
    </div>
  );
}

 
export default Worksite;
