from torchvision import transforms

def get_transforms():
    # Define the transformations: resize, center crop, convert to tensor, and normalize.
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        # Standard normalization values used for ImageNet
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                             std=[0.229, 0.224, 0.225]),
    ])
    return transform
