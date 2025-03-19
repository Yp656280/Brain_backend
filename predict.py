import argparse
import os
import json
from ultralytics import YOLO

def predict_tumor(image_path, model_path='best.pt'):
    """
    Predict tumor type from an input image using YOLOv8 classification model.
    Returns:
        dict: {'class': predicted_class, 'confidence': confidence}
    """
    # Load the trained model
    try:
        model = YOLO(model_path)
    except Exception as e:
        return {"error": f"Model not found at {model_path}. Please check the path"}

    # Check if image exists
    if not os.path.exists(image_path):
        return {"error": f"Image not found at {image_path}"}

    # Perform prediction
    results = model.predict(image_path, verbose=False)  # <== Disable YOLO logs

    # Get class names and prediction details
    class_names = ['glioma', 'meningioma', 'pituitary', 'notumor']
    top1_idx = results[0].probs.top1
    confidence = results[0].probs.top1conf.item()
    
    # Return as a JSON object
    return {"class": class_names[top1_idx], "confidence": round(confidence, 4)}

if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Brain Tumor Classification using YOLOv8')
    parser.add_argument('--image', type=str, required=True, help='Path to input image')
    parser.add_argument('--model', type=str, default='best.pt', help='Path to trained model')
    args = parser.parse_args()

    try:
        # Get prediction result
        result = predict_tumor(args.image, args.model)

        # Print JSON response (Only final output)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
