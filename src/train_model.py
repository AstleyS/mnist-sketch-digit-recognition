import os
from pathlib import Path

# Force CPU-only execution to avoid cuDNN/CUDA mismatches in environments
# where system CUDA/cuDNN versions don't match the TensorFlow build.
# You can remove this line if you have matching CUDA/cuDNN and want GPU training.
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

import tensorflow as tf
import tensorflowjs as tfjs
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from cnn_models import simple_cnn

# Training settings
BATCH_SIZE = 128
EPOCHS = 10
MODEL_DIR = Path('saved_models')
TFJS_DIR = Path('public/mnist_cnn_model_tfjs')
MODEL_PATH = MODEL_DIR / 'mnist_cnn_model.keras'

MODEL_DIR.mkdir(parents=True, exist_ok=True)
TFJS_DIR.mkdir(parents=True, exist_ok=True)

print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {tf.keras.__version__}")
print(f"GPU devices: {tf.config.list_physical_devices('GPU')}")



# Load the MNIST dataset https://keras.io/api/datasets/mnist/
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# Normalize the data and add channel dimension
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)


# Build the model
model = simple_cnn(
    num_classes=10,
    conv_filters=16,
    conv_kernel_size=(3, 3),
    conv_activation='relu',
    pool_size=(2, 2),
    dense_units=64,
    dense_activation='relu',
    output_activation='softmax'
)

# Compile the model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

callbacks = [
    EarlyStopping(
        monitor='val_accuracy',
        patience=3,
        restore_best_weights=True,
        verbose=1
    ),
    ModelCheckpoint(
        filepath=MODEL_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )
]

print('\nStarting MNIST training...')
model.fit(
    x_train,
    y_train,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    validation_data=(x_test, y_test),
    callbacks=callbacks,
    verbose=2
)

print('\nEvaluating model on test data...')
results = model.evaluate(x_test, y_test, verbose=2)
print(f'Test loss: {results[0]:.4f}, Test accuracy: {results[1] * 100:.2f}%')

try:
    # Save .keras model (best weights already restored by EarlyStopping)
    model.save(str(MODEL_PATH))
    print(f'✓ Keras model saved to {MODEL_PATH}')

    # Convert directly to TensorFlow.js format
    print(f'Converting to TFJS format at {TFJS_DIR}...')
    tfjs.converters.save_keras_model(model, str(TFJS_DIR))
    print('Model converted to TensorFlow.js format successfully.')

    import patch_model

except Exception as e:
    print(f'Error: {e}')