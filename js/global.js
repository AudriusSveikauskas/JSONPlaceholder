"use strict";

const CONTAINER = document.getElementById("content");
const CURRENT_PAGE = window.location.pathname.split("/").pop();

const POST_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
const USER_ENDPOINT = "https://jsonplaceholder.typicode.com/users";
const ALBUMS_ENDPOINT = "https://jsonplaceholder.typicode.com/albums";

function loadMoreBtn() {
  const loadMoreBtnWrapper = document.createElement("div");
  loadMoreBtnWrapper.classList.add(
    "d-grid",
    "gap-2",
    "col-6",
    "mx-auto",
    "mb-4",
    "container"
  );

  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.classList.add("btn", "btn-primary");
  loadMoreBtn.setAttribute("type", "button");
  loadMoreBtn.textContent = "Load more...";

  loadMoreBtnWrapper.append(loadMoreBtn);
  CONTAINER.after(loadMoreBtnWrapper);
  CONTAINER.append();

  loadMoreBtn.addEventListener("click", () => {
    if (CURRENT_PAGE === "post.html") {
      toggleLoadingAnimation();
      getPostById(startPostId, postLimit);
    }

    if (CURRENT_PAGE === "user.html") {
      toggleLoadingAnimation();
      getUserById(startUserId, userLimit);
    }

    if (CURRENT_PAGE === "album.html") {
      toggleLoadingAnimation();
      getAlbumById(startAlbumId, albumLimit);
    }
  });
}

function toggleLoadingAnimation() {
  document.querySelector(".loading-animation").toggleAttribute("hidden");
}

// PAGE NAVIGATION
const MENU_ITEMS = [
  { title: "Home", url: "index.html", id: "homePage" },
  { title: "Posts", url: "post.html", id: "postPage" },
  { title: "Users", url: "user.html", id: "userPage" },
  { title: "Albums", url: "album.html", id: "albumPage" },
];

const navBar = document.createElement("nav");
navBar.classList.add(
  "navbar",
  "bg-light",
  "border-bottom",
  "shadow-sm",
  "sticky-top"
);

const navBarContainer = document.createElement("div");
navBarContainer.classList.add("container");

const navBarBrand = document.createElement("a");
navBarBrand.classList.add("navbar-brand");
navBarBrand.setAttribute("href", "#");

const navBarLogo = document.createElement("img");
navBarLogo.setAttribute("src", "https://pixy.org/src/3/35836.png");
navBarLogo.setAttribute("alt", "Logo");
navBarLogo.setAttribute("height", "56");

const nav = document.createElement("ul");
nav.classList.add("nav", "nav-pills", "py-2");

MENU_ITEMS.map((item) => {
  const { title, url } = item;
  const navItem = document.createElement("li");
  navItem.classList.add("nav-item");
  const itemLink = document.createElement("a");
  itemLink.classList.add("nav-link");
  itemLink.setAttribute("href", `./${url}`);
  itemLink.textContent = `${title}`;

  const menuUrl = url.split("/").pop();

  if (CURRENT_PAGE === menuUrl) {
    itemLink.classList.add("active");
  }

  if (CURRENT_PAGE === "" && title === "Home") {
    itemLink.classList.add("active");
  }

  navItem.append(itemLink);
  nav.append(navItem);
});

const searchForm = document.createElement("form");
searchForm.classList.add("d-flex");
searchForm.setAttribute("role", "search");

const searchFormInput = document.createElement("input");
searchFormInput.classList.add("form-control", "me-2");
searchFormInput.setAttribute("type", "search");
searchFormInput.setAttribute("placeholder", "Search");
searchFormInput.setAttribute("aria-label", "Search");

const searchFormDropdown = document.createElement("div");
searchFormDropdown.classList.add("dropdown");

const searchFormButton = document.createElement("button");
searchFormButton.classList.add("btn", "btn-secondary", "dropdown-toggle");
searchFormButton.setAttribute("type", "button");
searchFormButton.setAttribute("id", "search-button");
searchFormButton.setAttribute("data-bs-toggle", "dropdown");
searchFormButton.setAttribute("aria-expanded", "false");
searchFormButton.textContent = "Search in: ";

searchFormButton.addEventListener("click", () => {
  const searchCategories = document.querySelectorAll(".dropdown-item");
  searchCategories.forEach((link) => {
    link.href = link.href + "&_like=" + searchFormInput.value;
  });
});

const searchFormDropdownList = document.createElement("ul");
searchFormDropdownList.classList.add("dropdown-menu");
searchFormDropdownList.setAttribute("aria-labelledby", "search-button");

const searchFormDropdownListItems = ["users", "posts", "comments", "albums"];
searchFormDropdownListItems.map((item) => {
  const listItem = document.createElement("li");
  const itemLink = document.createElement("a");
  itemLink.classList.add("dropdown-item");
  itemLink.setAttribute("href", `./search.html?_resource=${item}`);
  itemLink.textContent = `${item.charAt(0).toUpperCase()}${item
    .slice(1)
    .toLowerCase()}`;

  listItem.append(itemLink);
  searchFormDropdownList.append(listItem);
});

searchFormDropdown.append(searchFormButton, searchFormDropdownList);

searchForm.append(searchFormInput, searchFormDropdown);

navBarBrand.append(navBarLogo);
navBarContainer.append(navBarBrand, nav, searchForm);
navBar.append(navBarContainer);

CONTAINER.before(navBar);
