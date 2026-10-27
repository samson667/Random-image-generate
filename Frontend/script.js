
const API_URL = "http://localhost:3000/api/image";

const randomImage = document.getElementById("randomImage");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const imageInfo = document.getElementById("imageInfo");
const imageNumber = document.getElementById("imageNumber");
const newImageBtn = document.getElementById("newImageBtn");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");

let imageCount = 0;

async function loadRandomImage() {
  // Loading শুরু
  newImageBtn.disabled = true;
  buttonText.textContent = "Discovering...";
  errorMessage.textContent = "";

  try {
    // Backend API-তে request পাঠানো
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Backend থেকে সঠিক response আসেনি।");
    }

    const data = await response.json();

    if (!data.imageUrl) {
      throw new Error("Backend image URL পাঠায়নি।");
    }

    // Image load হওয়া পর্যন্ত অপেক্ষা
    const image = new Image();

    image.onload = () => {
      randomImage.src = data.imageUrl;
      randomImage.hidden = false;
      imagePlaceholder.hidden = true;

      imageCount++;

      imageInfo.textContent = `Image #${data.id}`;
      imageNumber.textContent =
        `#${String(imageCount).padStart(3, "0")}`;

      newImageBtn.disabled = false;
      buttonText.textContent = "Generate New Image";
    };

    image.onerror = () => {
      errorMessage.textContent =
        "ছবিটি লোড হয়নি। আবার চেষ্টা করো।";

      newImageBtn.disabled = false;
      buttonText.textContent = "Try Again";
    };

    image.src = data.imageUrl;

  } catch (error) {
    console.error(error);

    errorMessage.textContent =
      "Server no more run..."
    newImageBtn.disabled = false;
    buttonText.textContent = "Try Again";
  }
}

// Button click করলে নতুন ছবি আসবে
newImageBtn.addEventListener("click", loadRandomImage);
