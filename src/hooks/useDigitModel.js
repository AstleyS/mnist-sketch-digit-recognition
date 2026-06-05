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

    useEffect(() => {
        const loadModel = async () => {
            try {
                console.log('Loading model...')
                const loadedModel = await loadLayersModel('/mnist_cnn_model_tfjs/model.json')
                setModel(loadedModel)
                setIsModelLoaded(true)
                console.log('Model loaded successfully')
            } catch (error) {
                console.error('Error loading model:', error)
            }
        }

        loadModel()
    }, [])

    const predictDigit = async (canvas) => {
        if (!model) {
            console.error('Model is not loaded yet')
            return null
        }

        try {
            const predictionTensor = tf.tidy(() => {
                const tensor = tf.browser.fromPixels(canvas, 1)
                    .resizeNearestNeighbor([28, 28])
                    .toFloat()
                    .div(tf.scalar(255.0))
                    .expandDims(0)

                return model.predict(tensor)
            })

            const data = await predictionTensor.data()
            predictionTensor.dispose()

            return Array.from(data).map((confidence, digit) => ({
                digit: String(digit),
                confidence
            }))
        } catch (error) {
            console.error('Error while predicting digit:', error)
            return null
        }
    }

    return { isModelLoaded, predictDigit }
}

export default useDigitModel;