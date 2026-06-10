from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense


def simple_cnn(
    num_classes=10,
    conv_filters=16,
    conv_kernel_size=(3, 3),
    conv_activation='relu',
    pool_size=(2, 2),
    dense_units=64,
    dense_activation='relu',
    output_activation='softmax'
):
    """
    Builds a simple CNN model for image classification.
    This Simple CNN is a sequential model that consists of:
        1. An Input layer defining the shape of the input images.
        2. A Conv2D layer with specified filters, kernel size, and activation function.
        3. A MaxPooling2D layer to downsample the feature maps.
        4. A Flatten layer to convert the 2D feature maps into a 1D vector.
        5. A Dense layer with specified units and activation function.
        6. An output Dense layer with the number of classes and specified activation function.
    Args:
        num_classes (int): Number of output classes.
        conv_filters (int): Number of filters for Conv2D.
        conv_kernel_size (tuple): Kernel size for Conv2D.
        conv_activation (str): Activation for Conv2D.
        pool_size (tuple): Pool size for MaxPooling2D.
        dense_units (int): Number of units in Dense layer.
        dense_activation (str): Activation for Dense layer.
        output_activation (str): Activation for output layer.
    Returns:
        model (Sequential): A Keras Sequential model instance.
    """
    model = Sequential([
        Input(shape=(28, 28, 1)),  # Explicit Input layer required in Keras 3
        Conv2D(conv_filters, conv_kernel_size, activation=conv_activation),
        MaxPooling2D(pool_size),
        Flatten(),
        Dense(dense_units, activation=dense_activation),
        Dense(num_classes, activation=output_activation)
    ])
    return model