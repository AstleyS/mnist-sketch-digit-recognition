import React, { useEffect, useState, useRef } from 'react';
import './CanvasArea.css';

import { DIMENSIONS, DRAWING_STYLES } from '../../const';

import useDigitModel from '../../hooks/useDigitModel';


/*
  * CanvasArea component
  * This component is responsible for rendering the canvas area.
  * It does not receive any props.
*/
const CanvasArea = ({
  setPrediction
}) => {

  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { isModelLoaded, predictDigit } = useDigitModel();

  // It initializes the canvas and sets the context for drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = DIMENSIONS.canvasWidth;
    canvas.height = DIMENSIONS.canvasHeight;

    // Set the canvas background and drawing styles
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = DRAWING_STYLES.fillStyle
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = DRAWING_STYLES.strokeStyle
    ctx.lineWidth = DRAWING_STYLES.lineWidth
    ctx.lineCap = DRAWING_STYLES.lineCap
    contextRef.current = ctx
  }, []);

  const getPointerPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    }
  }

  const startDrawing = (e) => {
    const ctx = contextRef.current
    if (!ctx) return

    setIsDrawing(true);
    const { x, y } = getPointerPosition(e)

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    const ctx = contextRef.current
    if (!ctx) return

    setIsDrawing(false);
    ctx.closePath()
    handlePrediction()
  }
  
  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = contextRef.current
    if (!ctx) return

    const { x, y } = getPointerPosition(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const clearCanvas = () => {
    const ctx = contextRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.fillStyle = DRAWING_STYLES.fillStyle
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setPrediction(null)
  }

  const handlePrediction = async () => {
    if (!isModelLoaded) {
      console.error('Model is not loaded yet. Please wait.')
      return
    }

    const prediction = await predictDigit(canvasRef.current)
    setPrediction(prediction)
  }

  return (
    <div className="flex flex-col items-center">
      {!isModelLoaded && (
        <div className="mb-4 text-yellow-400 font-semibold">
          Model is loading, please wait...
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={isModelLoaded ? startDrawing : undefined}
        onMouseUp={isModelLoaded ? stopDrawing : undefined}
        onMouseMove={isModelLoaded ? draw : undefined}
        onMouseLeave={isModelLoaded ? stopDrawing : undefined}
        onTouchStart={isModelLoaded ? startDrawing : undefined}
        onTouchMove={isModelLoaded ? draw : undefined}
        onTouchEnd={isModelLoaded ? stopDrawing : undefined}
        className={`border border-gray-600 rounded shadow-md cursor-crosshair bg-black transition-opacity duration-300 ${
          isModelLoaded ? 'opacity-100' : 'opacity-50 pointer-events-none'
        }`}
        tabIndex={isModelLoaded ? 0 : -1}
      />
      <div className="mt-4 flex gap-4">
        <button
          className="!bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={clearCanvas}
          disabled={!isModelLoaded}
        >
          Clear
        </button>
      </div>
    </div>
  );
}


export default CanvasArea;
