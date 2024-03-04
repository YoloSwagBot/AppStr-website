import './App.css';

import React, { useState, useEffect, useRef } from 'react';

import {MDCRipple} from '@material/ripple';

import logo from './images/ic_appstr_brand_logo.svg'; 
import error_horse from './images/error_horse.png';
 

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
  // console.log("initial_dimensions: " + screenWidth + ", " + screenHeight);
  const isMobileWidth = screenWidth < 481;
  const isSmallScreen = !isMobileWidth && screenWidth < 1025;
  // const isLargerScreen = !isMobileWidth && !isSmallScreen;
  useEffect(() => {
    const handleResize = () => {
      // console.log("ON_RESIZE_EVENT: w: " + window.innerWidth + "    h: " + window.innerHeight);
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      // console.log("ON_RESIZE_EVENT: screenWidth: " + screenWidth + "    screenHeight: " + screenHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  var tickerHeight = 16;
  var toolbarHeight = 64;
  var brandIconSize = 24
  var tabIndicatorHeight = 8;
  var contentAreaMinCorners = 24;
  var contentAreaMaxCorners = 48;
  var contentAreaMinSideMargin = 32;
  var contentAreaMaxSideMargin = 64;
  if (isMobileWidth){
    tickerHeight = 16;
    toolbarHeight = 64;
    brandIconSize = 24;
    contentAreaMinCorners = 16;
    contentAreaMaxCorners = 8;
    contentAreaMinSideMargin = 16;
    contentAreaMaxSideMargin = 32;
  }else if(isSmallScreen){
    tickerHeight = 20;
    toolbarHeight = 80;
    brandIconSize = 32;
    contentAreaMinCorners = 32;
    contentAreaMaxCorners = 16;
    contentAreaMinSideMargin = 56;
    contentAreaMaxSideMargin = 98;
  }else{ // isLargerScreen
    tickerHeight = 20;
    toolbarHeight = 80;
    brandIconSize = 32;
    contentAreaMinCorners = 32;
    contentAreaMaxCorners = 16;
    contentAreaMinSideMargin = 56;
    contentAreaMaxSideMargin = 98;
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

  var currentSizeMargin = ((contentAreaTransY * (contentAreaMaxSideMargin - contentAreaMinSideMargin)) / (contentAreaMaxTransY - 0)) + contentAreaMinSideMargin;

  const tabs = ["About", "Apps", "WhereTo", "Other"];
  const toolbarWidth = (screenWidth-(currentSizeMargin*2)-brandIconSize)/2;
  return (
      <div className="main-container">
        <SuperBackground
          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY} />
        <ToolsTicker
          tickerHeight={tickerHeight}
          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}
          contentAreaMinSideMargin={contentAreaMinSideMargin} />
        <ToolbarArea
          top={tickerHeight}
          left={currentSizeMargin+(toolbarWidth)}
          right={(currentSizeMargin)}
          tickerHeight={tickerHeight}
          toolbarHeight={toolbarHeight}
          toolbarWidth={toolbarWidth}
          selectedPos={1}
          labels={tabs}
          tabIndicatorHeight={tabIndicatorHeight}
          opacity={1-(contentAreaTransY/contentAreaMaxTransY)} />
        <BrandArea/>
        <ContentArea

          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}

          contentAreaWidth={screenWidth-(currentSizeMargin*2)}
          contentAreaHeight={contentAreaHeight}
          contentAreaMinCorners={contentAreaMinCorners} 
          contentAreaMaxCorners={contentAreaMaxCorners}
          
          currentSizeMargin={currentSizeMargin} />
      </div>
  );
}

function SuperBackground(
  {
    contentAreaTransY,
    contentAreaMaxTransY
  }
) {
  return (
    <div className="super-background" style={{ backgroundColor: `#fdfecc` }}>
      <img id="error-horse" src={error_horse}
        style={{
          opacity: `${contentAreaTransY / contentAreaMaxTransY}`,
          transform: `translate(-50%, -50%)`,
          position: `absolute`,
          top: `50%`,
          left: `50%`,
          marginTop: `50px`
        }}/>
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
  // console.log("toolsTickerTransY: " + toolsTickerTransY);

  const toolsUsedText = "React(JSX), Google Cloud Platform(GCP), Helm, Kubernetes, Docker, Nginx, GraphQL(coming soon), PostgreSQL(coming soon), Kotlin/Compose/etc on Android, and more...";
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

function ToolbarArea(
  {
    top,

    toolbarHeight,
    toolbarWidth,

    labels,
    selectedPos,

    left,
    right,

    tabIndicatorHeight,

    opacity
  }
){
  // if mouseDown event is in a tab -> call ripple function with that tab's parameters
  // - there is a third lambda for onMouseUp + location is inside tab(selectedTab = pos)
  // - then onSelectedTab change -> start animating the TabIndicator+anything_else(content)
  // onEvent_MouseDown    // onUserInput_Down
  // rippleInTab(params)
  // onEvent_MouseLeave   // onUserInput_LeaveArea
  // onEvent_MouseUp      // onUserInput_Up
  // function onSelectedTabChanged(...)

  const numTabs = labels.length;
  const tabWidth = toolbarWidth/numTabs;
  const tabHeight = toolbarHeight-16;
  const tabs = labels.map((label, pos) => (
    <ToolbarTab 
      key={pos}
      tabPosition={pos}
      tabHeight={tabHeight}
      tabWidth={tabWidth}
      top={(toolbarHeight/2)}
      left={(pos*tabWidth)+(tabWidth/2)}
      label={label} />
  ));
  return(
    <div className="toolbar-area" style={{
      position: `absolute`,
      top: `${top}px`,
      left: `${left}px`,
      height: `${toolbarHeight}px`,
      width: `${toolbarWidth}px`,
      transform: `translate(-50%, 0%)`,
      opacity: `${opacity}`
    }}>
      {tabs}
      <ToolbarIndicator
        top={toolbarHeight-16}
        toolbarWidth={toolbarWidth}
        indicatorWidth={tabWidth}
        indicatorHeight={tabIndicatorHeight}
        labels={labels}
        selectedPos={selectedPos} />
    </div>
  )
}

function ToolbarTab(
  {
    tabPosition,

    tabHeight,
    tabWidth,
    top,
    left,

    label,
  }
){

  const tabFontSize = `24px`;
  const tabFontColor = `#792bef`; // #7e7aff

  return(
    <div className="toolbar-tab" 
      style={{
        position: `absolute`,
        width: `${tabWidth}px`,
        height: `${tabHeight}px`,
        transform: `translate(-50%, -50%)`,
        top: `${top}px`,
        left: `${left}px`,
        fontSize: tabFontSize,
        fontWeight: `bold`,
        color: tabFontColor,
        cursor: `pointer`,
      }} >
        <span style={{
          position: `absolute`,
          top: `${tabHeight/2}px`,
          left: `${tabWidth/2}px`,
          transform: `translate(-50%, -50%)`,
          userSelect: `none`
        }}>
          {label}
        </span>
    </div>
  )
}

function ToolbarIndicator(
  {
    top,
    toolbarWidth,

    indicatorWidth,
    indicatorHeight,

    labels,
    selectedPos,

    color
  }
){
  const left = (selectedPos*(indicatorWidth));
  return(
    <div className="tab-indicator" style={{
      position: `absolute`,
      height: `${indicatorHeight}px`,
      width: `${indicatorWidth}px`,
      top: `${top}px`,
      left: `${left}px`,
      backgroundColor: `cyan`,
      boxShadow: `${0} ${0}px ${20}px ${-4}px #000000`,
      zIndex: `4`
    }}>
      
    </div>
  );
}

function BrandArea(
  {
    contentAreaTransY,
    contentAreaMaxTransY,
  }
) {
  return (
    <div className="brand-area">
      <button className="brand-button">
        <img className="brand-icon" src={logo}  alt="Logo" width="32" height="32"  viewBox="0 0 100 100"/>

      </button>
    </div>
  );
}

function ContentArea(
  {
    contentAreaTransY,
    contentAreaMaxTransY,

    contentAreaWidth,
    contentAreaHeight, 
    contentAreaMinCorners, 
    contentAreaMaxCorners,

    currentSizeMargin
  }
) {
  // --content-area-height: calc(100vh - var(--ticker-height) - var(--toolbar-height));
  const rippleRef = useRef(null);
  const [isRippling, setIsRippling] = useState(false);
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  var initialRippleOffsetLeft = -1;
  var initialRippleOffsetTop = -1;

  useEffect(() => {
    // console.log("useEffect 00 -- isRippling: " + isRippling);
    if (coords.x != -1 && coords.y != -1){
      // console.log("useEffect 01")
      setIsRippling(true);
      setTimeout(() =>  setIsRippling(false), 3000);
    }else{
      // console.log("useEffect 02")
      setIsRippling(false);
    }
  });

  const [isInputDown, setIsInputDown] = useState(false);
  var buttonRect;
  const handleMouseDown = (event) => {
    setIsInputDown(true);
    setIsRippling(true);
    // Calculate ripple center coordinates relative to the div
    buttonRect = rippleRef.current.getBoundingClientRect();
    initialRippleOffsetLeft = event.target.offsetLeft;
    initialRippleOffsetTop = event.target.offsetTop;
    setCoords({
      x: event.clientX - initialRippleOffsetLeft,
      y: event.clientY - initialRippleOffsetTop,
    })
    
    // draw here

  };
  const handleMouseMove = (event) => {
    if (isInputDown && (coords.x != -1 && coords.y != -1)){
      // onDownMoveX = event.clientX - buttonRect.left;
      // onDownMoveY = event.clientY - buttonRect.top;
      console.log("event.clientX: " + event.clientX + " --- event.target.offsetLeft: " + event.target.offsetLeft);
      setCoords({ 
      x: event.clientX - initialRippleOffsetLeft,
      y: event.clientY - initialRippleOffsetTop,
      })
      // console.log("handleMouseMove:      coords.x: " + coords.x + " --- coords.y: " + coords.y + " --- "
      //   + "event.clientX: " + event.clientX + " --- event.target.offsetLeft: " + event.target.offsetLeft);
      // re-draw here
    }
  }
  const handleMouseUp = (event) => {
    setIsInputDown(false);
    setIsRippling(false);
    setCoords({ x: -1, y: -1 })
    // console.log("mouseUp --- tab, pos: " + tabPosition);
    // stop/remove drawing

  };
  const handleMouseLeave = (event) => {
    if (isInputDown){
      // console.log("mouseLeave --- tab, pos: " + tabPosition);
    }
    setIsInputDown(false);
    setIsRippling(false);
    setCoords({ x: -1, y: -1 })
    // stop/remove drawing

  };


  var currentCornerSize = ((contentAreaTransY * (contentAreaMaxCorners - contentAreaMinCorners)) / (contentAreaMaxTransY - 0)) + contentAreaMinCorners;
  return (
    <div
      className="content-area"
      ref={rippleRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={
        {
          position: `absolute`,
          height: `${contentAreaHeight}px`,
          width: `${contentAreaWidth}px`,
          transform: `translateY(${contentAreaTransY}px)`,
          borderTopLeftRadius: `${currentCornerSize}px`,
          borderTopRightRadius: `${currentCornerSize}px`,
          left: `${currentSizeMargin}px`,
          right: `${currentSizeMargin}px`,
          bottom: `${0}px`,
          backgroundColor: 'lightsalmon'
        }
      }>
      {isRippling ? 
        <span className="ripple"
          style={{
            position: 'absolute',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: `translate(-50%, -50%)`
          }}
        />
      : ""}
    </div>
  );
}
 
export default Worksite;
