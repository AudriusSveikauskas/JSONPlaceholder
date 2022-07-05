"use strict";

const MENU_ITEMS = [
  { title: "Home", url: "index.html", id: "homePage" },
  { title: "Post", url: "post.html", id: "postPage" },
  { title: "User", url: "user.html", id: "userPage" },
  { title: "Album", url: "album.html", id: "albumPage" },
];
const container = document.getElementById("content");
const currentPage = window.location.pathname.split("/").pop();

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

  if (currentPage === menuUrl) {
    itemLink.classList.add("active");
  }

  navItem.append(itemLink);
  nav.append(navItem);
});

navBarBrand.append(navBarLogo);
navBarContainer.append(navBarBrand, nav);
navBar.append(navBarContainer);

container.before(navBar);
