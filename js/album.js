"use strict";

let albumLimit = 2;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let currentPage = Number(urlParams.get("_page"));
let totalPages;

if (currentPage === 0) {
  currentPage = 1;
}

async function getInfo(page, limit) {
  const albumId = urlParams.get("_albumId");
  return await new Promise((resolve) => {
    let fetchUrl = `${ALBUMS_ENDPOINT}?_page=${page}&_limit=${limit}&_expand=user&_embed=photos`;

    if (albumId !== null) {
      fetchUrl = `${ALBUMS_ENDPOINT}?id=${albumId}&_expand=user&_embed=photos`;
    }

    fetch(fetchUrl)
      .then((response) => {
        const totalAlbums = Number(response.headers.get("x-total-count"));
        totalPages = Math.ceil(totalAlbums / albumLimit);
        return response;
      })
      .then((response) => response.json())
      .then((data) => resolve(data));
  });
}

function showInfo() {
  toggleLoadingAnimation();
  getInfo(currentPage, albumLimit).then((arr) => {
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

      //

      fetch(
        `https://pixabay.com/api/?key=23683988-abaed29beae397d28600f0b4f&q=${albumId}&per_page=${photos.length}`
      )
        .then((response) => response.json())
        .then((photosArr) => {
          photos.map((photo, index) => {
            const { id: photoId, title: photoTitle } = photo;
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
            carouselItemImgEl.setAttribute(
              "src",
              `${photosArr.hits[index].webformatURL}`
            );
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
            carouselSlideTextEl.classList.add("mb-0");
            carouselSlideTextEl.textContent = `Photo #${photoId}`;

            carouselCaptionEl.append(carouselSlideLabelEl, carouselSlideTextEl);
            carouselItemEl.append(carouselItemImgEl, carouselCaptionEl);
            carouselInnerEl.append(carouselItemEl);
          });
        });

      //

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
    showPagination();
    toggleLoadingAnimation();
  });
}

function createPagesArr() {
  let pagesToShow = [];

  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    if (currentPage - 5 >= 1 && currentPage + 4 <= totalPages) {
      for (let i = currentPage - 5; i <= currentPage + 4; i++) {
        pagesToShow.push(i);
      }
    } else if (currentPage - 5 < 1) {
      for (let i = 1; i <= 10; i++) {
        pagesToShow.push(i);
      }
    } else {
      for (let i = totalPages - 9; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    }
  }

  return pagesToShow;
}

function showPagination() {
  const pages = createPagesArr();

  const paginationWrapper = document.createElement("nav");
  paginationWrapper.classList.add("container", "mb-4", "d-flex");

  const pagination = document.createElement("ul");
  pagination.classList.add("pagination", "mx-auto");

  pages.map((page, index) => {
    if (index === 0 && page > 1) {
      pagination.append(createPaginationEl("First", false));
      if (page === currentPage) {
        pagination.append(createPaginationEl(page, true));
      } else {
        pagination.append(createPaginationEl(page, false));
      }
    }

    if (index !== 0 && index < pages.length - 1) {
      if (page === currentPage) {
        pagination.append(createPaginationEl(page, true));
      } else {
        pagination.append(createPaginationEl(page, false));
      }
    }

    if (index === pages.length - 1) {
      if (page === currentPage) {
        pagination.append(createPaginationEl(page, true));
      } else {
        pagination.append(createPaginationEl(page, false));
      }
      if (page < totalPages) {
        pagination.append(createPaginationEl("Last", false, totalPages));
      }
    }
  });

  paginationWrapper.append(pagination);
  CONTAINER.after(paginationWrapper);
}

function createPaginationEl(page, isCurrent, totalPages) {
  const pageLink = `./album.html?_limit${albumLimit}&_page=`;

  const paginationPageItem = document.createElement("li");
  paginationPageItem.classList.add("page-item");

  const paginationPageLink = document.createElement("a");
  paginationPageLink.classList.add("page-link");
  paginationPageLink.textContent = page;

  if (page === "First") {
    paginationPageLink.setAttribute("href", `${pageLink}1`);
  } else if (page === "Last") {
    paginationPageLink.setAttribute("href", `${pageLink}${totalPages}`);
  } else {
    if (isCurrent) {
      paginationPageItem.classList.add("active");
    } else {
      paginationPageLink.setAttribute("href", `${pageLink}${page}`);
    }
  }

  paginationPageItem.append(paginationPageLink);
  return paginationPageItem;
}

showInfo();
