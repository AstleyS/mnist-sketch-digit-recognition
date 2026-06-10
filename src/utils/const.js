import CodeSection from "../components/CodeSection/CodeSection";
import DrawSection from "../components/DrawSection/DrawSection";
import ExplanationSection from "../components/ExplanationSection/ExplanationSection";

export const TABS = {
    draw: {
        tab: 'draw',
        label: 'Draw & Test',
        component: DrawSection
    },
    /*
    code: {
        tab: 'code',
        label: 'Code Playground',
        component: CodeSection
    },
    */
    explanation: {
        tab: 'explanation',
        label: 'How it Works',
        component: ExplanationSection
    }
};

export const DIMENSIONS = {
    canvasWidth: 280,
    canvasHeight: 280,
    canvasBorderRadius: 10,
    canvasBorderWidth: 2,
    canvasBackgroundColor: '#1a202c',
    canvasStrokeColor: '#f7fafc',
};

export const DRAWING_STYLES = {
    strokeStyle: 'white',
    lineWidth: 20,
    lineCap: 'round',
    fillStyle: 'black',
};

export function getRandomPrediction() {
    // Generate a random confidence for each digit 0-9, keep order
    const predictions = [];
    let topDigit = 0;
    let topConfidence = 0;

    for (let d = 0; d < 10; d++) {
        const confidence = +(Math.random() * 0.99).toFixed(2); // 0.00 to 0.99
        predictions.push({
            digit: String(d),
            confidence
        });
        if (confidence > topConfidence) {
            topConfidence = confidence;
            topDigit = d;
        }
    }

    // Highlight the top prediction, but keep order
    predictions[topDigit].isTop = true;

    return predictions;
}


export const MODEL_CONFIG = {
  modelPath: '/mnist_cnn_model_tfjs/model.json',
  inputShape: [28, 28, 1],   // Height, Width, Channels
  numClasses: 10,            // Digits 0-9
  topPredictions: 3          // Number of top predictions to show
};
