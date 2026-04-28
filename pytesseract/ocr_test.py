import pytesseract
from PIL import Image

# 1. Point to your Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def run_ocr():
    try:
        # 2. Load your image
        img = Image.open('pytest.png')

        # 3. Convert image to string
        text = pytesseract.image_to_string(img)

        # 4. Print the results
        print("--- Extraction Result ---")
        print(text)
        print("-------------------------")

    except FileNotFoundError:
        print("Error: 'test.png' not found. Check your file name!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_ocr()
