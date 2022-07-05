"use strict";

const POST_LIMIT = 5;
let startPostId = 0;

const postsEndpoint = "https://jsonplaceholder.typicode.com/posts";
const usersEndpoint = "https://jsonplaceholder.typicode.com/users";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("_postId");

if (postId === null) {
  getPostById(startPostId, POST_LIMIT);
  loadMoreBtn();
} else {
  getPostById(postId, 1);
}

function getPostById(start, limit) {
  fetch(`${postsEndpoint}?_start=${start}&_limit=${limit}`)
    .then((response) => response.json())
    .then((posts) => {
      posts.map((post) => {
        const { id: postId, title: postTitle, body: postBody, userId } = post;

        let postObj = {
          postId: postId,
          postTitle: postTitle,
          postBody: postBody,
          userId: userId,
        };

        getUserById(userId).then((user) => {
          const { name: userName } = user;
          postObj = { userName: userName, ...postObj };
          getComments(postId).then((comments) => {
            postObj = { postComments: comments, ...postObj };
            showPost(postObj);
          });
        });
      });
    });
  startPostId += limit;
}

async function getUserById(userId) {
  return await fetch(`${usersEndpoint}/${userId}`)
    .then((response) => response.json())
    .then((user) => user);
}

async function getComments(postId) {
  return await fetch(`${postsEndpoint}/${postId}/comments`)
    .then((response) => response.json())
    .then((comments) => comments);
}

function showPost(postObj) {
  const { postTitle, postBody, userId, userName, postComments } = postObj;

  const cardEl = document.createElement("div");
  cardEl.classList.add("card", "mt-4");

  const cardBodyEl = document.createElement("div");
  cardBodyEl.classList.add("card-body");

  const postTitleEl = document.createElement("h5");
  postTitleEl.classList.add("card-title", "text-uppercase");
  postTitleEl.textContent = postTitle;

  const authorAvatarEl = document.createElement("img");
  authorAvatarEl.classList.add("rounded-circle", "me-2");
  authorAvatarEl.setAttribute("src", `https://i.pravatar.cc/50?img=${userId}`);
  authorAvatarEl.setAttribute("alt", "Avatar");

  const authorLinkEl = document.createElement("a");
  authorLinkEl.setAttribute("href", `user.html?_userId=${userId}`);
  authorLinkEl.textContent = userName;

  const authorNameEl = document.createElement("h6");
  authorNameEl.classList.add("card-subtitle", "mb-2", "text-muted");

  const postBodyEl = document.createElement("p");
  postBodyEl.classList.add("card-text");
  postBodyEl.textContent = postBody;

  const commentsEl = document.createElement("div");
  commentsEl.classList.add("list-group", "list-group-flush", "mt-4");
  commentsEl.setAttribute("hidden", "true");

  const commentBtnWrapper = document.createElement("div");
  commentBtnWrapper.classList.add("d-flex", "justify-content-end");

  const commentBtnEl = document.createElement("button");
  commentBtnEl.classList.add("btn", "btn-secondary");
  commentBtnEl.setAttribute("type", "button");
  commentBtnEl.innerHTML = `Comments <span class="badge text-bg-light">${postComments.length}</span>`;
  commentBtnEl.addEventListener("click", () => {
    commentsEl.toggleAttribute("hidden");
  });

  postComments.map((comment) => {
    const { name: commentTitle, email: userEmail, body: commentBody } = comment;

    const commentItem = document.createElement("div");
    commentItem.classList.add("alert", "alert-secondary");

    const commentTitleEl = document.createElement("h6");
    commentTitleEl.classList.add(
      "card-subtitle",
      "mt-2",
      "text-muted",
      "text-uppercase"
    );
    commentTitleEl.textContent = commentTitle;

    const commentAuthorEl = document.createElement("a");
    commentAuthorEl.classList.add("d-block", "mb-2", "mt-1");
    commentAuthorEl.setAttribute("href", `mailto: ${userEmail}`);
    commentAuthorEl.textContent = userEmail;

    const commentBodyEl = document.createElement("p");
    commentBodyEl.classList.add("card-text", "mb-2");
    commentBodyEl.textContent = commentBody;

    commentItem.append(commentTitleEl, commentAuthorEl, commentBodyEl);
    commentsEl.append(commentItem);
  });

  const dividerEl = document.createElement("hr");

  commentBtnWrapper.append(commentBtnEl);
  cardBodyEl.append(
    postTitleEl,
    authorAvatarEl,
    authorLinkEl,
    postBodyEl,
    dividerEl,
    commentBtnWrapper,
    commentsEl
  );
  cardEl.append(cardBodyEl);
  container.append(cardEl);
}

function loadMoreBtn() {
  const loadMoreBtnWrapper = document.createElement("div");
  loadMoreBtnWrapper.classList.add(
    "d-grid",
    "gap-2",
    "col-6",
    "mx-auto",
    "mt-4",
    "mb-4"
  );

  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.classList.add("btn", "btn-primary");
  loadMoreBtn.setAttribute("type", "button");
  loadMoreBtn.textContent = "Load more...";

  loadMoreBtnWrapper.append(loadMoreBtn);
  container.after(loadMoreBtnWrapper);
  container.append();

  loadMoreBtn.addEventListener("click", () => {
    if (currentPage === "post.html") {
      getPostById(startPostId, POST_LIMIT);
    }
  });
}
