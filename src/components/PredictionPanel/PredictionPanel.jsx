import React from 'react';
import './PredictionPanel.css';

/*
  * PredictionPanel component
  * This component displays the top predictions for the drawn digit.
  * It receives a prediction prop which is an array of objects containing digit and confidence.
*/
const PredictionPanel = ({ prediction }) => {
  if (!prediction || prediction.length === 0) {
    return (
      <div className="lg:w-80 bg-gray-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-orange-400 mb-4 text-center">No Predictions Yet</h2>
        <p className="text-gray-400 text-center">Draw a digit to see predictions from the MNIST model.</p>
      </div>
    );
  }

  const sortedPredictions = [...prediction].sort((a, b) => b.confidence - a.confidence)
  const topPrediction = sortedPredictions[0]
  const top3 = sortedPredictions.slice(0, 3)

  return (
    <div className="lg:w-80 bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-orange-400 mb-4 text-center">Top Predictions</h2>
      {topPrediction && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-400">Best prediction</p>
          <p className="text-3xl font-bold text-white">{topPrediction.digit}</p>
          <p className="text-sm text-gray-300">{(topPrediction.confidence * 100).toFixed(1)}% confidence</p>
        </div>
      )}
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-3 text-center">
        Shows the top 3 predictions for each stroke.
      </p>
      <ul className="space-y-2">
        {top3.map((pred, i) => {
          const barWidth = `${Math.round(pred.confidence * 100)}%`;
          const rankLabels = ['1st', '2nd', '3rd']
          return (
            <li
              key={i}
              className={`flex items-center px-2 py-2 rounded bg-gray-700 relative ${i === 0 ? 'border border-orange-400' : ''}`}
            >
              <span className="text-sm text-gray-300 w-12">{rankLabels[i]}</span>
              <span className="text-xl font-bold w-6 text-center z-10">{pred.digit}</span>
              <div
                className="absolute left-0 top-0 h-full rounded bg-orange-500 opacity-20"
                style={{
                  width: barWidth,
                  zIndex: 0,
                }}
              />
              <span className="ml-auto text-sm text-gray-300 z-10">{(pred.confidence * 100).toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PredictionPanel;
