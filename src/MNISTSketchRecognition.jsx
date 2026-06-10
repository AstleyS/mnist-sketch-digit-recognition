import React, { useState } from 'react';

import Header from './components/Header/Header';
import TabNavigation from './components/TabNavigation/TabNavigation';

import { TABS } from './utils/const';

const MNISTSketchRecognition = () => {

  const [activeTab, setActiveTab] = useState('draw')
  const ActiveSection = TABS[activeTab].component;

  return (
    <>
    
    <div className='min-h-screen bg.gray-900 text-white'>
      { /* Header */ }
      <Header />

      { /* Tab Navigation */ }
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
       />

      { /* Section */ }
      <div className="flex-1">
        { /* Content based on active tab */ }
        {
          <ActiveSection />
        }

      </div>

    </div>
    
    </>
 
  );
}   

export default MNISTSketchRecognition;