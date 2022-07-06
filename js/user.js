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
  getUserById(userId - 1, 1);
}

function getUserById(start, limit) {
  fetch(`${USER_ENDPOINT}?_start=${start}&_limit=${limit}`)
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
  const {
    id: userId,
    name,
    username,
    phone,
    email,
    address,
    website,
    company,
  } = userObj;

  const cardEl = document.createElement("div");
  cardEl.classList.add("card", "mt-4");

  const rowEl = document.createElement("div");
  rowEl.classList.add("row", "g-0");

  const avatarColEl = document.createElement("div");
  avatarColEl.classList.add("col-md-4");

  const avatarPicEl = document.createElement("img");
  avatarPicEl.classList.add("img-fluid", "rounded-top-left");
  avatarPicEl.setAttribute("src", `https://i.pravatar.cc/350?img=${userId}`);
  avatarPicEl.setAttribute("alt", `${name}`);

  const contentColEl = document.createElement("div");
  contentColEl.classList.add("col-md-8");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h4");
  cardTitle.classList.add("card-title");
  cardTitle.innerHTML = `${name} / <span class="badge bg-secondary">${username}</span>`;

  const contactEl = document.createElement("ul");
  contactEl.classList.add("list-group", "list-group-flush", "mt-3");

  const contactPhoneEl = document.createElement("li");
  contactPhoneEl.classList.add("list-group-item", "d-flex", "gap-3");
  contactPhoneEl.innerHTML = `<i class="las la-phone la-2x"></i>
                              <span class="align-self-center">
                              <a class="text-decoration-none" href="tel:${phone}">${phone}</a>
                              </span>`;

  const contactEmailEl = document.createElement("li");
  contactEmailEl.classList.add("list-group-item", "d-flex", "gap-3");
  contactEmailEl.innerHTML = `<i class="las la-envelope la-2x"></i>
                              <span class="align-self-center">
                              <a class="text-decoration-none" href="mailto:${email}">${email}</a>
                              </span>`;

  const { street, suite, city, zipcode, geo } = address;
  const { lat, lng } = geo;
  const contactAddressEl = document.createElement("li");
  contactAddressEl.classList.add("list-group-item", "d-flex", "gap-3");
  contactAddressEl.innerHTML = `<i class="las la-map-marker la-2x align-self-center"></i>
                                <span class="align-self-center">
                                <a class="text-decoration-none" href="https://www.mapquest.com/latlng/${lat},${lng}?zoom=4" target="_blank">
                                ${street}, ${suite}<br>${city}, ${zipcode}</a>
                                </span>`;

  contactEl.append(contactPhoneEl, contactEmailEl, contactAddressEl);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  const accordionEl = document.createElement("div");
  accordionEl.classList.add("accordion", "mt-2", "mb-2");
  accordionEl.setAttribute("id", `accordion-${userId}`);

  // MAP item
  const accordionMapEl = document.createElement("div");
  accordionMapEl.classList.add("accordion-item");

  const accordionMapHeaderEl = document.createElement("h2");
  accordionMapHeaderEl.classList.add("accordion-header");
  accordionMapHeaderEl.setAttribute("id", `map-${userId}`);

  const accordionMapButtonEl = document.createElement("button");
  accordionMapButtonEl.classList.add("accordion-button", "collapsed");
  accordionMapButtonEl.setAttribute("type", "button");
  accordionMapButtonEl.setAttribute("data-bs-toggle", "collapse");
  accordionMapButtonEl.setAttribute(
    "data-bs-target",
    `#collapse-map-${userId}`
  );
  accordionMapButtonEl.setAttribute("aria-expanded", "false");
  accordionMapButtonEl.setAttribute("aria-controls", `collapse-map-${userId}`);
  accordionMapButtonEl.textContent = "Map & Driving Directions";

  accordionMapHeaderEl.append(accordionMapButtonEl);

  const accordionMapBodyWrapperEl = document.createElement("div");
  accordionMapBodyWrapperEl.classList.add("accordion-collapse", "collapse");
  accordionMapBodyWrapperEl.setAttribute("id", `collapse-map-${userId}`);
  accordionMapBodyWrapperEl.setAttribute("aria-labelledby", `map-${userId}`);
  accordionMapBodyWrapperEl.setAttribute(
    "data-bs-parent",
    `accordion-${userId}`
  );

  const accordionMapBodyEl = document.createElement("iframe");
  accordionMapBodyEl.setAttribute("width", "100%");
  accordionMapBodyEl.setAttribute("height", "350px");
  accordionMapBodyEl.setAttribute(
    "src",
    `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=3&output=embed`
  );

  accordionMapBodyWrapperEl.append(accordionMapBodyEl);
  accordionMapEl.append(accordionMapHeaderEl, accordionMapBodyWrapperEl);

  // COMPANY item
  const accordionCompanyEl = document.createElement("div");
  accordionCompanyEl.classList.add("accordion-item");

  const accordionCompanyHeaderEl = document.createElement("h2");
  accordionCompanyHeaderEl.classList.add("accordion-header");
  accordionCompanyHeaderEl.setAttribute("id", `company-${userId}`);

  const accordionCompanyButtonEl = document.createElement("button");
  accordionCompanyButtonEl.classList.add("accordion-button", "collapsed");
  accordionCompanyButtonEl.setAttribute("type", "button");
  accordionCompanyButtonEl.setAttribute("data-bs-toggle", "collapse");
  accordionCompanyButtonEl.setAttribute(
    "data-bs-target",
    `#collapse-company-${userId}`
  );
  accordionCompanyButtonEl.setAttribute("aria-expanded", "false");
  accordionCompanyButtonEl.setAttribute(
    "aria-controls",
    `collapse-company-${userId}`
  );
  accordionCompanyButtonEl.textContent = "Company Profile";

  accordionCompanyHeaderEl.append(accordionCompanyButtonEl);

  const accordionCompanyBodyWrapperEl = document.createElement("div");
  accordionCompanyBodyWrapperEl.classList.add("accordion-collapse", "collapse");
  accordionCompanyBodyWrapperEl.setAttribute(
    "id",
    `collapse-company-${userId}`
  );
  accordionCompanyBodyWrapperEl.setAttribute(
    "aria-labelledby",
    `company-${userId}`
  );
  accordionCompanyBodyWrapperEl.setAttribute(
    "data-bs-parent",
    `accordion-${userId}`
  );

  const accordionCompanyBodyEl = document.createElement("div");
  accordionCompanyBodyEl.classList.add("accordion-body");

  const { name: companyName, catchPhrase, bs } = company;
  const accordionCompanyDlEl = document.createElement("dl");
  accordionCompanyDlEl.classList.add("row", "mt-3");

  const accordionCompanyNameDtEl = document.createElement("dt");
  accordionCompanyNameDtEl.classList.add("col-sm-3");
  accordionCompanyNameDtEl.textContent = "Company Name";

  const accordionCompanyNameDdEl = document.createElement("dd");
  accordionCompanyNameDdEl.classList.add("col-sm-9");
  accordionCompanyNameDdEl.textContent = companyName;

  const accordionCompanyBsDtEl = document.createElement("dt");
  accordionCompanyBsDtEl.classList.add("col-sm-3");
  accordionCompanyBsDtEl.textContent = "Business Strategy";

  const accordionCompanyBsDdEl = document.createElement("dd");
  accordionCompanyBsDdEl.classList.add("col-sm-9");
  accordionCompanyBsDdEl.textContent = bs;

  const accordionCompanyMottoDtEl = document.createElement("dt");
  accordionCompanyMottoDtEl.classList.add("col-sm-3");
  accordionCompanyMottoDtEl.textContent = "Motto";

  const accordionCompanyMottoDdEl = document.createElement("dd");
  accordionCompanyMottoDdEl.classList.add("col-sm-9", "fst-italic");
  accordionCompanyMottoDdEl.textContent = `"${catchPhrase}"`;

  const accordionCompanyWebsiteDtEl = document.createElement("dt");
  accordionCompanyWebsiteDtEl.classList.add("col-sm-3");
  accordionCompanyWebsiteDtEl.textContent = "Website";

  const accordionCompanyWebsiteDdEl = document.createElement("dd");
  accordionCompanyWebsiteDdEl.classList.add("col-sm-9");
  accordionCompanyWebsiteDdEl.textContent = website;

  accordionCompanyDlEl.append(
    accordionCompanyNameDtEl,
    accordionCompanyNameDdEl,
    accordionCompanyBsDtEl,
    accordionCompanyBsDdEl,
    accordionCompanyMottoDtEl,
    accordionCompanyMottoDdEl,
    accordionCompanyWebsiteDtEl,
    accordionCompanyWebsiteDdEl
  );

  accordionCompanyBodyEl.append(accordionCompanyDlEl);
  accordionCompanyBodyWrapperEl.append(accordionCompanyBodyEl);
  accordionCompanyEl.append(
    accordionCompanyHeaderEl,
    accordionCompanyBodyWrapperEl
  );

  // POSTS item
  const accordionPostsEl = document.createElement("div");
  accordionPostsEl.classList.add("accordion-item");

  const accordionPostsHeaderEl = document.createElement("h2");
  accordionPostsHeaderEl.classList.add("accordion-header");
  accordionPostsHeaderEl.setAttribute("id", `posts-${userId}`);

  const accordionPostsButtonEl = document.createElement("button");
  accordionPostsButtonEl.classList.add("accordion-button", "collapsed");
  accordionPostsButtonEl.setAttribute("type", "button");
  accordionPostsButtonEl.setAttribute("data-bs-toggle", "collapse");
  accordionPostsButtonEl.setAttribute(
    "data-bs-target",
    `#collapse-posts-${userId}`
  );
  accordionPostsButtonEl.setAttribute("aria-expanded", "false");
  accordionPostsButtonEl.setAttribute(
    "aria-controls",
    `collapse-posts-${userId}`
  );
  accordionPostsButtonEl.textContent = `Posts written by - ${name}`;

  accordionPostsHeaderEl.append(accordionPostsButtonEl);

  const accordionPostsBodyWrapperEl = document.createElement("div");
  accordionPostsBodyWrapperEl.classList.add("accordion-collapse", "collapse");
  accordionPostsBodyWrapperEl.setAttribute("id", `collapse-posts-${userId}`);
  accordionPostsBodyWrapperEl.setAttribute(
    "aria-labelledby",
    `posts-${userId}`
  );
  accordionPostsBodyWrapperEl.setAttribute(
    "data-bs-parent",
    `accordion-${userId}`
  );

  const accordionPostsBodyEl = document.createElement("div");
  accordionPostsBodyEl.classList.add("accordion-body");
  accordionPostsBodyEl.textContent = "POSTS";

  accordionPostsBodyWrapperEl.append(accordionPostsBodyEl);
  accordionPostsEl.append(accordionPostsHeaderEl, accordionPostsBodyWrapperEl);
  //
  accordionEl.append(accordionMapEl, accordionCompanyEl, accordionPostsEl);
  cardFooter.append(accordionEl);

  avatarColEl.append(avatarPicEl);
  cardBody.append(cardTitle, contactEl);
  contentColEl.append(cardBody);

  rowEl.append(avatarColEl, contentColEl);
  cardEl.append(rowEl, cardFooter);

  CONTAINER.append(cardEl);
}

function getMap(lat, lng) {
  return `<iframe height="400" width="500"
    src="https://www.mapquest.com/embed/latlng/${lat},${lng}?center=${lat},${lng}&zoom=1&maptype=map">
    </iframe>`;
}
