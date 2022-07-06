"use strict";

const userLimit = 2;
let startUserId = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get("_userId");

if (userId === null) {
  toggleLoadingAnimation();
  getUserById(startUserId, userLimit);
  loadMoreBtn();
} else {
  toggleLoadingAnimation();
  getUserById(userId, 1);
}

function getUserById(start, limit) {
  fetch(`${USER_ENDPOINT}?_start=${start - 1}&_limit=${limit}`)
    .then((response) => response.json())
    .then((users) => {
      users.map((user) => {
        const { id: userId } = user;
        let userObj = { ...user };

        getPostByUserId(userId).then((posts) => {
          userObj = { userPosts: posts, ...userObj };
          getAlbumsByUserId(userId).then((albums) => {
            userObj = { userAlbums: albums, ...userObj };
            showUser(userObj);
          });
        });
      });
      toggleLoadingAnimation();
    });
  startUserId += limit;
}

async function getPostByUserId(userId) {
  return await fetch(`${USER_ENDPOINT}/${userId}/posts`)
    .then((response) => response.json())
    .then((posts) => posts);
}

async function getAlbumsByUserId(userId) {
  return await fetch(`${USER_ENDPOINT}/${userId}/albums`)
    .then((response) => response.json())
    .then((posts) => posts);
}

function showUser(userObj) {
  const { id: userId, name, username } = userObj;

  const cardEl = document.createElement("div");
  cardEl.classList.add("card", "mt-4");

  const rowEl = document.createElement("div");
  rowEl.classList.add("row", "g-0");

  const avatarColEl = document.createElement("div");
  avatarColEl.classList.add("col-md-4");

  const avatarPicEl = document.createElement("img");
  avatarPicEl.classList.add("img-fluid", "rounded-top-left");
  avatarPicEl.setAttribute("src", `https://i.pravatar.cc/250?img=${userId}`);
  avatarPicEl.setAttribute("alt", `${name}`);

  const contentColEl = document.createElement("div");
  contentColEl.classList.add("col-md-8");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h4");
  cardTitle.classList.add("card-title");
  cardTitle.innerHTML = `${name} / <span class="badge bg-secondary">${username}</span>`;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  cardFooter.textContent = "Footer";

  avatarColEl.append(avatarPicEl);
  cardBody.append(cardTitle, cardText);
  contentColEl.append(cardBody);

  rowEl.append(avatarColEl, contentColEl);
  cardEl.append(rowEl, cardFooter);

  CONTAINER.append(cardEl);
}
