import * as tf from '@tensorflow/tfjs'
import { loadLayersModel } from '@tensorflow/tfjs'
import { useEffect, useState } from 'react'

/*
 * useDigitModel hook
 * This hook loads a pre-trained TensorFlow.js MNIST model from the public directory
 * and exposes a `predictDigit` function that accepts a canvas element.
 */
const useDigitModel = () => {
  const [model, setModel] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelUrl = `${import.meta.env.BASE_URL}mnist_cnn_model_tfjs/model.json`
        console.log(`Loading model from ${modelUrl}...`)
        const loadedModel = await loadLayersModel(modelUrl)
        setModel(loadedModel)
        setIsModelLoaded(true)
        setLoadError(null)
        console.log('✓ Model loaded successfully')
      } catch (error) {
        const errorMsg = error?.message || String(error)
        console.error('✗ Failed to load model:', errorMsg)
        setLoadError(errorMsg)
        setIsModelLoaded(false)
      }
    }

    loadModel()
  }, [])

  const predictDigit = (canvas) => {
    if (!model) {
      console.error('Model is not loaded yet')
      return null
    }

    try {
      // tf.tidy() automatically disposes all intermediate tensors created inside it.
      // The key rule: whatever you return from tidy() is NOT disposed — it stays alive.
      // But here we use dataSync() to read the values synchronously before tidy()
      // finishes, which means we get a plain JS array back (not a tensor).
      // That plain array is safe to use outside tidy() with no disposal needed.
      const predictions = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(canvas, 1) // (H, W, 1) grayscale
          .resizeNearestNeighbor([28, 28])              // (28, 28, 1)
          .toFloat()
          .div(255.0)                                   // normalize to [0, 1]
          .expandDims(0)                                // (1, 28, 28, 1) — batch dim

        // dataSync() reads values into a plain Float32Array synchronously,
        // so no tensor escapes tidy() and everything is cleaned up automatically.
        return Array.from(model.predict(tensor).dataSync())
      })

      // predictions is now a plain JS array of 10 confidence values, one per digit
      return predictions.map((confidence, digit) => ({
        digit: String(digit),
        confidence,
      }))
    } catch (error) {
      console.error('Error while predicting digit:', error)
      return null
    }
  }

  return { isModelLoaded, predictDigit, loadError }
}

export default useDigitModel