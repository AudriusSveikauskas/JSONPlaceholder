"use strict";

let startAlbumId = 9;
let albumLimit = 2;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const albumId = urlParams.get("_albumId");

if (albumId !== null) {
  startAlbumId = albumId - 1;
  albumLimit = 1;
}

async function getInfo(start, limit) {
  return await new Promise((resolve) => {
    fetch(
      `${ALBUMS_ENDPOINT}?_start=${start}&_limit=${limit}&_expand=user&_embed=photos`
    )
      .then((response) => response.json())
      .then((data) => resolve(data));
  });
}

function showInfo() {
  getInfo(startAlbumId, albumLimit).then((arr) => {
    console.log(arr);
    arr.map((album) => {
      const { id: albumId, title: albumTitle, user, photos, userId } = album;

      const albumCardEl = document.createElement("div");
      albumCardEl.classList.add("card", "mt-4");

      const albumCardBodyEl = document.createElement("div");
      albumCardBodyEl.classList.add("card-body");

      const albumCardTitleEl = document.createElement("h5");
      albumCardTitleEl.classList.add("card-title");
      albumCardTitleEl.textContent = albumTitle.toUpperCase();

      const albumCardTextEl = document.createElement("p");
      albumCardTextEl.classList.add("card-text");
      albumCardTextEl.innerHTML = `Author: <a class="text-decoration-none" href="./user.html?_userId=${userId}">${user.name}</a>, ${photos.length} photos.`;

      const albumCardTextSmallEl = document.createElement("p");
      albumCardTextSmallEl.classList.add("card-text");

      const albumCardTextMutedEl = document.createElement("small");
      albumCardTextMutedEl.classList.add("text-muted");
      albumCardTextMutedEl.textContent = `Album #${albumId}`;

      const carouselSlideEl = document.createElement("div");
      carouselSlideEl.classList.add("carousel", "slide");
      carouselSlideEl.setAttribute("id", `carousel-${albumId}`);
      carouselSlideEl.setAttribute("data-bs-ride", "false");

      const carouselInnerEl = document.createElement("div");
      carouselInnerEl.classList.add("carousel-inner");

      albumCardTextSmallEl.append(albumCardTextMutedEl);
      albumCardBodyEl.append(
        albumCardTitleEl,
        albumCardTextEl,
        albumCardTextSmallEl
      );
      albumCardEl.append(albumCardBodyEl);

      photos.map((photo, index) => {
        const { id: photoId, title: photoTitle, url: photoUrl } = photo;
        const carouselItemEl = document.createElement("div");
        carouselItemEl.classList.add("carousel-item");

        if (index === 0) {
          carouselItemEl.classList.add("active");
        }

        const carouselItemImgEl = document.createElement("img");
        carouselItemImgEl.classList.add(
          "d-block",
          "w-100",
          "carousel-image-height"
        );
        carouselItemImgEl.setAttribute("src", photoUrl);
        carouselItemImgEl.setAttribute("alt", photoTitle);

        const carouselCaptionEl = document.createElement("div");
        carouselCaptionEl.classList.add(
          "carousel-caption",
          "d-none",
          "d-md-block"
        );

        const carouselSlideLabelEl = document.createElement("h5");
        carouselSlideLabelEl.textContent = `${photoTitle
          .charAt(0)
          .toUpperCase()}${photoTitle.slice(1).toLowerCase()}`;

        const carouselSlideTextEl = document.createElement("p");
        carouselSlideTextEl.textContent = `Photo #${photoId}`;

        carouselCaptionEl.append(carouselSlideLabelEl, carouselSlideTextEl);
        carouselItemEl.append(carouselItemImgEl, carouselCaptionEl);
        carouselInnerEl.append(carouselItemEl);
      });

      const carouselControlPrevEl = document.createElement("button");
      carouselControlPrevEl.classList.add("carousel-control-prev");
      carouselControlPrevEl.setAttribute("type", "button");
      carouselControlPrevEl.setAttribute(
        "data-bs-target",
        `#carousel-${albumId}`
      );
      carouselControlPrevEl.setAttribute("data-bs-slide", "prev");

      const carouselControlPrevIconEl = document.createElement("span");
      carouselControlPrevIconEl.classList.add("carousel-control-prev-icon");
      carouselControlPrevIconEl.setAttribute("aria-hidden", "true");

      const carouselVisuallyHiddenPrevEl = document.createElement("span");
      carouselVisuallyHiddenPrevEl.classList.add("visually-hidden");
      carouselControlPrevEl.append(
        carouselControlPrevIconEl,
        carouselVisuallyHiddenPrevEl
      );

      const carouselControlNextEl = document.createElement("button");
      carouselControlNextEl.classList.add("carousel-control-next");
      carouselControlNextEl.setAttribute("type", "button");
      carouselControlNextEl.setAttribute(
        "data-bs-target",
        `#carousel-${albumId}`
      );
      carouselControlNextEl.setAttribute("data-bs-slide", "next");

      const carouselControlNextIconEl = document.createElement("span");
      carouselControlNextIconEl.classList.add("carousel-control-next-icon");
      carouselControlNextIconEl.setAttribute("aria-hidden", "true");

      const carouselVisuallyHiddenNextEl = document.createElement("span");
      carouselVisuallyHiddenNextEl.classList.add("visually-hidden");

      carouselControlNextEl.append(
        carouselControlNextIconEl,
        carouselVisuallyHiddenNextEl
      );

      carouselSlideEl.append(
        carouselInnerEl,
        carouselControlPrevEl,
        carouselControlNextEl
      );

      albumCardEl.append(carouselSlideEl);
      CONTAINER.append(albumCardEl);
    });
  });
}

showInfo();