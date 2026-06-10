import React from 'react';
import './TabNavigation.css';
import { TABS } from '../../utils/const';

/*
  * TabNavigation component
  * This component is responsible for rendering the tab navigation.
  * It receives activeTab and setActiveTab as props.
*/

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-gray-900 border-b border-gray-800 shadow-md">
      <div className="flex justify-center gap-2 py-2">
        {Object.entries(TABS).map(([key, tab]) => {
          const isActive = activeTab === tab.tab;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(tab.tab)}
              className={`
                relative px-7 py-3 mx-1 rounded-t-lg font-semibold transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                ${isActive
                  ? 'bg-gradient-to-b from-orange-500 to-orange-400 text-white shadow-lg scale-105 border-b-4 border-orange-400 z-10'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-orange-200 border-b-4 border-transparent'
                }
              `}
              style={{
                boxShadow: isActive
                  ? '0 4px 16px 0 rgba(255,140,0,0.15)'
                  : undefined,
              }}
            >
              <span className="tracking-wide">{tab.label}</span>
              {isActive && (
                <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-6 h-1 rounded-b bg-orange-400 shadow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;