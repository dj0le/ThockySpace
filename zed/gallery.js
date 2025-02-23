//
// Gallery.js is the module for the image gallery page
// galleryState / LocalStorage saves the form values
// searchImageGallery() -> function to capture user inputs and create the api url
// loadImageGallery() -> fetches the search results and displays them in an image grid
// formatCardDate() -> converts unix date format to human readable date like "01 Jan 2025"
// displayImageInfo() -> updates the gallery image info box to display results and info
//

let galleryState = {
  numImages: parseInt(localStorage.getItem("numImages")) || 0,
  newCords: localStorage.getItem("newCords") || "",
  newRad: localStorage.getItem("newRad") || "",
  newStart: parseInt(localStorage.getItem("newStart")) || "",
  newEnd: parseInt(localStorage.getItem("newEnd")) || "",
  newUrl: localStorage.getItem("newUrl") || "",
};

function setState(newState) {
  Object.assign(galleryState, newState);

  localStorage.setItem("numImages", galleryState.numImages);
  localStorage.setItem("newCords", galleryState.newCords);
  localStorage.setItem("newRad", galleryState.newRad);
  localStorage.setItem("newStart", galleryState.newStart);
  localStorage.setItem("newEnd", galleryState.newEnd);
  localStorage.setItem("newUrl", galleryState.newUrl);

  displayImageInfo();
}

function formatCardDate(unixdate) {
  let date = new Date(unixdate * 1000);
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "short" });
  let year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function displayImageInfo() {
  const imageTotal = document.querySelector(".total-images");
  const currentCords = document.querySelector(".current-coords");
  const currentRad = document.querySelector(".current-radius");
  const currentDates = document.querySelector(".current-dates");

  if (imageTotal) imageTotal.innerHTML = `${galleryState.numImages}`;
  if (currentCords) currentCords.innerHTML = `${galleryState.newCords}`;
  if (currentRad) currentRad.innerHTML = `${galleryState.newRad}`;
  if (currentDates)
    currentDates.innerHTML = `${formatCardDate(galleryState.newStart)} - ${formatCardDate(galleryState.newEnd)}`;
}

export function searchImageGallery() {
  console.log("searchImageGallery function called and executed");
  const startDateInput = document.getElementById("start-date").value;
  const endDateInput = document.getElementById("end-date").value;
  const radius = document.getElementById("radius").value;
  const getCoords = document.getElementById("coord-input").value;

  const startDate = Math.floor(
    new Date(startDateInput).setUTCHours(0, 0, 0, 0) / 1000,
  );
  const endDate = Math.floor(
    new Date(endDateInput).setUTCHours(23, 59, 59, 999) / 1000,
  );

  const queryParams = new URLSearchParams({
    cords: getCoords,
    radius: radius,
    start: startDate,
    end: endDate,
  }).toString();

  const imageUrl = `/photo_search?${queryParams}`;

  setState({
    newCords: getCoords,
    newRad: radius,
    newStart: startDate,
    newEnd: endDate,
    newUrl: imageUrl,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/gallery") {
    function loadImageGallery() {
      let url = localStorage.getItem("newUrl");
      if (!url) {
        url =
          "/photo_search?cords=48.34028%2C38.31482&radius=6000&start=1719792000&end=1729727999";
        console.log("using default search parameters");
      }

      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok " + res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          const imageArray = data.photos;
          let totalImages = imageArray.length;

          setState({ numImages: totalImages });

          const newList = document.querySelector(".card-list");
          const fragment = document.createDocumentFragment();

          imageArray.forEach((card) => {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.style.backgroundImage = `url(${card.url})`;

            const newContent = document.createElement("div");
            newContent.classList.add("card-content");

            const newIcons = document.createElement("div");
            newIcons.classList.add("card-icons");

            const icons = [
              { src: "/static/assets/icon-google.svg", alt: "Google" },
              { src: "/static/assets/icon-vk.svg", alt: "VK" },
              { src: "/static/assets/icon-map.svg", alt: "Map" },
            ];

            icons.forEach((icon) => {
              const newIcon = document.createElement("a");
              newIcon.classList.add("card-icon");
              let vkLink = Math.abs(card.owner_id);
              newIcon.href = `https://vk.com/id${vkLink}`;
              const img = document.createElement("img");
              img.src = icon.src;
              img.alt = icon.alt;
              newIcon.appendChild(img);
              newIcons.appendChild(newIcon);
            });

            const newDate = document.createElement("div");
            newDate.classList.add("card-date");
            newDate.innerHTML = `<p>${formatCardDate(card.date)}</p>`;

            newContent.appendChild(newIcons);
            newContent.appendChild(newDate);
            newCard.appendChild(newContent);
            fragment.appendChild(newCard);
          });

          newList.innerHTML = "";
          newList.appendChild(fragment);
        })
        .catch((error) => {
          // If no images are found with the input search parameters
          const noResults = document.querySelector(".card-list");
          const errorDiv = document.createElement("div");
          errorDiv.classList.add("error");

          const errorTitle = document.createElement("h1");
          errorTitle.classList.add("error-title");
          errorTitle.textContent = "NO RESULTS FOUND";

          const errorMessage = document.createElement("p");
          errorMessage.textContent = "try searching with different paramaters";

          errorDiv.appendChild(errorTitle);
          errorDiv.appendChild(errorMessage);

          noResults.innerHTML = "";
          noResults.appendChild(errorDiv);
        });
    }

    loadImageGallery();
  }
});
