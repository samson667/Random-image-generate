
const API_URL = " https://random-image-generate-31c8.onrender.com/api/image";

const randomImage = document.getElementById("randomImage");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const imageInfo = document.getElementById("imageInfo");
const imageNumber = document.getElementById("imageNumber");
const newImageBtn = document.getElementById("newImageBtn");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");

let imgCount_local=localStorage.getItem("count_img_search")

let imageCount = imgCount_local || 0;
   
imageNumber.textContent=`#${imageCount}`

async function loadRandomImage() {
  // Start loading
  newImageBtn.disabled = true;
  buttonText.textContent = "Discovering...";
  errorMessage.textContent = "";

  try {
    // Send a request to the backend API
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("The backend did not return a valid response.");
    }

    const data = await response.json();

    if (!data.imageUrl) {
      throw new Error("The backend did not provide an image URL.");
    }

    // Wait until the image loads
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

      localStorage.setItem("count_img_search", imageCount);


    };

    image.onerror = () => {
      errorMessage.textContent =
        "The image failed to load. Please try again.";

      newImageBtn.disabled = false;
      buttonText.textContent = "Try Again";
    };

    image.src = data.imageUrl;

  } catch (error) {
    console.error(error);

    errorMessage.textContent =
      "The server is no longer running.";

    newImageBtn.disabled = false;
    buttonText.textContent = "Try Again";
  }
}

// Load a new image when the button is clicked
newImageBtn.addEventListener("click", loadRandomImage);


