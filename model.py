import torch
import torch.nn as nn
from torchvision import models

def get_model(weights_path='mobilenetv2_plantvillage20.pth', num_classes=29):
    # Load MobileNetV2 with default ImageNet weights
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    
    # Modify the classifier to match your number of classes
    in_features = model.last_channel  # typically 1280 for MobileNetV2
    model.classifier[1] = nn.Linear(in_features, num_classes)

    # Load the trained model weights
    model.load_state_dict(torch.load(weights_path, map_location='cpu'))

    model.eval()  # Set the model to evaluation mode
    return model

if __name__ == '__main__':
    model = get_model()
    print("Model loaded successfully!")
