"use strict";

const CONTAINER = document.getElementById("content");
const CURRENT_PAGE = window.location.pathname.split("/").pop();

const POST_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
const USER_ENDPOINT = "https://jsonplaceholder.typicode.com/users";

//const ALBUMS_ENDPOINT = "https://jsonplaceholder.typicode.com/albums";

function loadMoreBtn() {
  const loadMoreBtnWrapper = document.createElement("div");
  loadMoreBtnWrapper.classList.add(
    "d-grid",
    "gap-2",
    "col-6",
    "mx-auto",
    "mt-4",
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
  });
}

function toggleLoadingAnimation() {
  document.querySelector(".loading-animation").toggleAttribute("hidden");
}
