

import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-use-gesture';

import logo from './images/ic_appstr_brand_logo.svg';
import icApps from './images/ic_apps.svg';
import icWhereTo from './images/ic_whereto.svg';
import icOther from './images/ic_other.svg';
import error_horse from './images/error_horse.png';

import appGeoAlarm from './images/apps/ic_app_geoalarm.svg';
import appTimeControl from './images/apps/ic_app_timecontrol.svg';
import appDevOpts from './images/apps/ic_app_devopts.png';
import appFTP from './images/apps/ic_app_ftp.png';


// 000080 : dark_blue
// 2a7fff : light_blue
// 5fbcd3 : cyanish
// 5fd3bc : tealish
// ffdd55 : yellow
// ff9955 : orange
// ff80b2 : pink
// fc3c3c : red


function Webpage() {
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [screenHeight, setHeight] = useState(window.innerHeight);
  
  const screenRatio = Math.min(1, (screenWidth - 500) / (1024-500));
  // console.log("screenRatio: " + screenRatio);

  const handleResize = () => {
    // console.log("ON_RESIZE_EVENT: w: " + window.innerWidth + "    h: " + window.innerHeight);
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    // console.log("ON_RESIZE_EVENT: screenWidth: " + screenWidth + "    screenHeight: " + screenHeight);
  };
  window.addEventListener('resize', handleResize);

  // value = Math.round(min + (diff * ratio))
  var tickerHeight = Math.round(16 + ((20-16) * screenRatio));
  var toolbarHeight = Math.round(64 + ((80-64) * screenRatio));
  var brandIconSize = Math.round(24 + ((32-24) * screenRatio));
  var tabIndicatorHeight = Math.round(16 + ((32-16) * screenRatio));
  var contentAreaMinCorners = Math.round(16 + ((20-16) * screenRatio));
  var contentAreaCorners = Math.round(8 + ((16-8) * screenRatio));
  var contentAreaMinSideMargin = Math.round(16 + ((56-16) * screenRatio));
  var contentAreaMaxSideMargin = Math.round(32 + ((98-32) * screenRatio));


  const contentAreaHeight = screenHeight - toolbarHeight - tickerHeight;

  var contentAreaMaxTransY = contentAreaHeight - contentAreaCorners;
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
  
  const contentAreaWidth = screenWidth - (currentSizeMargin*2)

  const [selectedPos, setSelectedPos] = useState(0);
  const tabs = ["Apps", "WhereTo", "Other"];
  const toolbarWidth = (screenWidth-(currentSizeMargin*2)-brandIconSize)/2;


  const tabColors = ['#2a7fff', '#5fd3bc', 'lightsalmon'];

  return (
      <div className="main-container" style={{
        height: `${100}vh`,
        width: `${100}vw`
      }}>
        <SuperBackground
          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY} />
        <ToolsTicker
          tickerHeight={tickerHeight}
          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}
          contentAreaMinSideMargin={contentAreaMinSideMargin} />
        <ToolbarArea
          screenRatio={screenRatio}
          top={tickerHeight}
          left={currentSizeMargin+(toolbarWidth)}
          right={(currentSizeMargin)}
          tickerHeight={tickerHeight}
          toolbarHeight={toolbarHeight}
          toolbarWidth={toolbarWidth}
          labels={tabs}
          tabIndicatorHeight={tabIndicatorHeight}
          opacity={1-(contentAreaTransY/contentAreaMaxTransY)}

          selectedPos={selectedPos} 
          onSelectPos={setSelectedPos} />
        <BrandArea screenRatio={screenRatio}/>
        <ContentArea

          contentAreaTransY={contentAreaTransY}
          contentAreaMaxTransY={contentAreaMaxTransY}
          contentAreaWidth={contentAreaWidth}
          contentAreaHeight={contentAreaHeight}

          contentAreaCorners={contentAreaCorners}

          currentSizeMargin={currentSizeMargin}
          
          currentTab={selectedPos}
          tabColors={tabColors} />
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
    <div className="super-background" style={{ 
      height: `${100}vh`,
      width: `${100}vw`,
      zIndex: `${0}`,
      backgroundColor: 'whitesmoke',
      justifyContent: `center`,
      alignItems: `center`,
      display: `flex`
    }}>
      <img id="error-horse" src={error_horse}
        style={{
          position: `absolute`,
          scale: `50%`,

          opacity: `${contentAreaTransY / contentAreaMaxTransY}`,
          bottom: `64px`,
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
  
  const scrollbarStyle = {
    '&::-webkit-scrollbar': {
      width: '0px',
      background: 'transparent',
    },
  };
  
  return (
    <div className="tools-ticker"
      style={{
        position: `absolute`,
        top: `${0}px`,
        height: `${20}px`,
        zIndex: `5`,
        backgroundColor: `#d9ff7a`,
        boxShadow: `${0} ${0}px ${10}px ${-4}px black`,
        borderBottomLeftRadius: `${8}px`,
        borderBottomRightRadius: `${8}px`,

        transform: `translateY(${toolsTickerTransY}px)`,
        left: `${contentAreaMinSideMargin}px`,
        right: `${contentAreaMinSideMargin}px`
      }}>
        <div className="tools-ticker-text" style={{
          marginLeft: `${16}px`,
          whiteSpace: `nowrap`,
          textOverflow: `clip`,
          overflow: `scroll`,
        }}>
            {toolsUsedText}
        </div>
    </div>
  );
}

function ToolbarArea(
  {
    screenRatio,

    top,

    toolbarHeight,
    toolbarWidth,

    labels,

    selectedPos, 
    onSelectPos,

    left,
    right,

    tickerHeight,
    tabIndicatorHeight,

    opacity
  }
){
  const numTabs = labels.length;
  const tabWidth = toolbarWidth/numTabs;
  const tabHeight = toolbarHeight-16;
  const icons = [
    icApps,
    icWhereTo,
    icOther
  ]
  const tabs = labels.map((label, pos) => (
    <ToolbarTab
      screenRatio={screenRatio}
      key={pos}
      pos={pos}
      tabHeight={tabHeight}
      tabWidth={tabWidth}
      top={48}
      left={(pos*tabWidth)+(tabWidth/2)}
      label={label}
      iconName={icons[pos]}

      selected={selectedPos}
      setSelectedPos={onSelectPos} />
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
        selectedPos={selectedPos}
        top={(tickerHeight+toolbarHeight-tabIndicatorHeight)}
        toolbarWidth={toolbarWidth}
        indicatorWidth={tabWidth}
        indicatorHeight={tabIndicatorHeight}
        labels={labels} />
    </div>
  )
}

function ToolbarTab(
  {
    screenRatio,

    pos,

    tabHeight,
    tabWidth,
    top,
    left,

    setSelectedPos,

    label,
    iconName
  }
){
  const handleClick = () => {
    // console.log("ToolbarTab_handleClick_newPos: " + pos);
    setSelectedPos(pos);
  }

  const tabFontSize = `${10 + ((20-10) * screenRatio)}px`;
  const tabFontColor = `#000`; // #7e7aff
  return(
    <div className="toolbar-tab"
      key={pos}
      onClick={handleClick}
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
        cursor: 'pointer'
    }} >
      <img className="tab-icon" src={iconName} width="24" height="24"  viewBox="0 0 100 100"
        style={{
          position: `absolute`,
          top: `${8}px`,
          left: `${tabWidth/2}px`,
          transform: `translate(-50%, -50%)`
        }}
      />
      <span style={{
        position: `absolute`,
        top: `${tabHeight/2}px`,
        left: `${tabWidth/2}px`,
        transform: `translate(-50%, -50%)`
      }}>
        {label}
      </span>
    </div>
  )
}

function ToolbarIndicator(
  {
    selectedPos,

    top,
    toolbarWidth,

    indicatorWidth,
    indicatorHeight,

    labels,

    color
  }
){
  // console.log("ToolbarIndicator_selectedPos: " + selectedPos);
  const left = (selectedPos*(indicatorWidth));
  return(
    <div className="tab-indicator" style={{
      position: `absolute`,
      height: `${indicatorHeight}px`,
      width: `${indicatorWidth}px`,
      top: `${top}px`,
      left: `${left}px`,
      backgroundColor: `#ff80b2`,
      boxShadow: `${0} ${0}px ${20}px ${-4}px #000000`,
      zIndex: `4`
    }}>
      
    </div>
  );
}

function BrandArea(
  {
    screenRatio,

    contentAreaTransY,
    contentAreaMaxTransY,
  }
) {
  const brandAreaTopMargin = 10 + ((20-10)*screenRatio);
  const buttonRightMargin = 4 + ((32-4)*screenRatio);
  return (
    <div className="brand-area" style={{

      position: `absolute`,
      top: `${brandAreaTopMargin}px`,
      right: `${0}px`,
      height: `${80}px`,
      marginLeft: `auto`,
      display: `flex`,
      alignItems: `center`,
      backgroundColor: `transparent`
    }}>
      <button className="brand-button" style={{
        marginRight: `${buttonRightMargin}px`,
        width: `${48}px`,
        height: `${48}px`,
        border: `#FFFFFF10`,
        background: `white`,
        borderRadius: `100%`,
        cursor: `pointer`,    
        boxShadow: `${0} ${2}px ${6}px rgba(0, 0, 0, 0.25)`
      }}>
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

    contentAreaCorners, 
    
    currentSizeMargin,

    currentTab,
    tabColors
  }
) {

  return (
    <div className="content-area" style={
      {
        position: `absolute`,
        bottom: `${0}px`,
        height: `${contentAreaHeight}px`,
        boxShadow: `${0} ${0}px ${20}px ${-4}px black`,
        zIndex: `5`,

        transform: `translateY(${contentAreaTransY}px)`,
        borderTopLeftRadius: `${contentAreaCorners}px`,
        borderTopRightRadius: `${contentAreaCorners}px`,
        
        left: `${currentSizeMargin}px`,
        width: `${contentAreaWidth}px`,

        justifyContent: 'center',

        backgroundColor: `${tabColors[currentTab]}`
      }
    }>
      { (() => {
        switch(currentTab){
          // default:
          //   return <About />
          default:
            return <Apps appsAreaWidth={contentAreaWidth-(2*contentAreaCorners)} />
          case 1:
            return <WhereTo />
          case 2:
            return <Other />
        }
      })()}
    </div>
  );
}

function Apps(
  {
    appsAreaWidth
  }
){
  const itemSize = 160;
  const iconSize = 80;
  const marginLeftRight = 32;
  const numRowItems = Math.floor((appsAreaWidth - (marginLeftRight*2)) / (itemSize*1.20));
  
  // console.log("numItems: " + numRowItems + " -- appsWidth: " + appsAreaWidth + " -- mLR*2: " + (marginLeftRight*2) + " -- itemSize: " + (itemSize*1.1));

  return (
    <div style={{
        position: `absolute`,
        marginTop: '16px',
        height: '100%',
        left: `${marginLeftRight}px`,
        right: `${marginLeftRight}px`,
    }}>
      <span style={{
        color: "white", fontSize: '30px', fontWeight: '1000' 
      }}>Google Play Store:</span>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numRowItems}, 1fr)` }}>
        <App itemSize={itemSize} appIcon={appGeoAlarm} appIconSize={iconSize} appNameText={"GeoAlarm"} 
          appLinkURL={"https://play.google.com/store/apps/details?id=com.appstr.geoalarm.prod"}/>
        <App itemSize={itemSize} appIcon={appTimeControl} appIconSize={iconSize} appNameText={"Time Control"}
          appLinkURL={"https://play.google.com/store/apps/details?id=com.appstr.timecontrol"}/>
        <App itemSize={itemSize} appIcon={appDevOpts} appIconSize={iconSize} appNameText={"Developer Options"}
          appLinkURL={"https://play.google.com/store/apps/details?id=com.appstr.devopts"}/>
        <App itemSize={itemSize} appIcon={appFTP} appIconSize={iconSize} appNameText={"FTP"}
          appLinkURL="https://play.google.com/store/apps/details?id=com.appstr.ftp"/>
      </div>
    </div>
  );
}

function App(
  {
    itemSize,

    appIcon,
    appIconSize,
    appNameText,
    appLinkURL
  }
){
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  return(
    <div style={{
      width: `${itemSize}px`,
      height: `${itemSize}px`,
      margin: `32px`,
      display: 'flex',
      justifyContent: 'center'
    }} onClick={() => openInNewTab(appLinkURL)} >
      <img src={appIcon}
        style={{
          position: `absolute`,
          width: `${appIconSize}px`,
          height: `${appIconSize}px`,
          objectFit: "cover",
          borderRadius: '16px',
          backgroundColor: "white"
        }}/>
        <span style={{ color: 'white', marginTop: `${appIconSize}px` }}>{appNameText}</span>
    </div>
  )
}

function WhereTo(
  {

  }
){
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <span style={{ color: "white", fontSize: '30px', fontWeight: '1000' }}>Work in progress.</span>
      <span style={{ color: "white", fontSize: '30px', fontWeight: '1000' }}>(GraphQL/PostgreSQL features, coming soon!)</span>
    </div>
  );
}

function Other(
  {

  }
){
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const lastUpdatedText = "March 2024"
  const marginLeftRight = 32;
  return (
    <div style={
      {
        position: `absolute`,
        marginTop: '16px',
        height: '100%',
        left: `${marginLeftRight}px`,
        right: `${marginLeftRight}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }>
      <span style={{
          color: "white",
          fontWeight: '1000' 
        }}
        margin='64px'>Last Updated:    {lastUpdatedText}</span>
      <div style={{ margin: '64px' }} onClick={() => openInNewTab("https://www.linkedin.com/in/i-make-the-app-rull-gud")} >
        <span style={{ fontWeight: '1000', color: 'blue' }} >LinkedIn</span>
        </div>
      <div>
        <span style={{ fontWeight: '1000', color: 'blue' }} onClick={() => openInNewTab("https://github.com/yoloswagbot")} >GitHub</span>
      </div>
      <div style={{ margin: '64px' }} >
        <span style={{ fontWeight: '1000', color: 'blue' }} onClick={() => openInNewTab("https://play.google.com/store/apps/developer?id=AppStr")} >Google Play Store</span>
      </div>
    </div>
  );
}

export default Webpage;

