"use strict";

const resources = [
  {
    endPoint: "users",
    keys: [
      "name",
      "username",
      "email",
      "address.street",
      "address.suite",
      "address.city",
      "address.zipcode",
      "phone",
      "website",
      "company.name",
      "company.catchPhrase",
      "company.bs",
    ],
  },
  {
    endPoint: "posts",
    keys: ["title", "body"],
  },
  {
    endPoint: "comments",
    keys: ["name", "email", "body"],
  },
  {
    endPoint: "albums",
    keys: ["title"],
  },
  {
    endPoint: "photos",
    keys: ["title"],
  },
];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchResource = urlParams.get("_resource");
const searchPhrase = urlParams.get("_like");

const searchWrapper = document.createElement("div");
searchWrapper.classList.add("mt-4");

resources.map((item) => {
  if (item.endPoint === searchResource) {
    item.keys.map(async (key) => {
      await fetch(
        `https://jsonplaceholder.typicode.com/${searchResource}?${key}_like=${searchPhrase}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            throw new Error(key);
          }
          return data;
        })
        .then((data) => {
          showSuccessSearchResults(key, data, searchPhrase, searchResource);
        })
        .catch((error) => {
          showFailedSearchResults(key, searchResource);
        });
    });
  }
});

function showSuccessSearchResults(key, data, searchPhrase, searchResource) {
  const result = document.createElement("p");
  result.classList.add("alert", "alert-success");
  const title = document.createElement("h5");
  title.textContent = `${searchResource.toUpperCase()} / ${key
    .replace(".", " / ")
    .toUpperCase()}`;
  const resultsList = document.createElement("ul");

  data.map((item) => {
    let originalSentence;
    if (key === "address.street") {
      originalSentence = item["address"]["street"];
    } else if (key === "address.suite") {
      originalSentence = item["address"]["suite"];
    } else if (key === "address.city") {
      originalSentence = item["address"]["city"];
    } else if (key === "address.zipcode") {
      originalSentence = item["address"]["zipcode"];
    } else if (key === "company.name") {
      originalSentence = item["company"]["name"];
    } else if (key === "company.catchPhrase") {
      originalSentence = item["company"]["catchPhrase"];
    } else if (key === "company.bs") {
      originalSentence = item["company"]["bs"];
    } else {
      originalSentence = item[`${key}`];
    }

    const startIndex = originalSentence
      .toLowerCase()
      .indexOf(searchPhrase.toLowerCase());
    const endIndex = startIndex + searchPhrase.length;
    const resultsListItem = document.createElement("li");
    const sentenceStart = originalSentence.slice(0, startIndex);
    const sentenceMiddle = originalSentence.slice(startIndex, endIndex);
    const sentenceEnd = originalSentence.slice(endIndex);

    resultsListItem.innerHTML = `${sentenceStart}<mark>${sentenceMiddle}</mark>${sentenceEnd}`;
    resultsList.append(resultsListItem);
  });
  result.append(title, resultsList);
  searchWrapper.append(result);
}

function showFailedSearchResults(key, searchResource) {
  const result = document.createElement("p");
  result.classList.add("alert", "alert-danger");
  const title = document.createElement("h5");
  title.textContent = `${searchResource.toUpperCase()} / ${key
    .replace(".", " / ")
    .toUpperCase()}`;
  const resultText = document.createElement("div");
  resultText.innerHTML = `Your search for <span class="fst-italic fw-bolder">"${searchPhrase}"</span> retrieved no results.`;
  result.append(title, resultText);
  searchWrapper.append(result);
}

function showPageTitle() {
  const searchTitle = document.createElement("h3");
  searchTitle.classList.add("mt-4");
  searchTitle.innerHTML = `Showing results for <span class="fst-italic fw-bolder">"${searchPhrase}"</span>`;
  CONTAINER.prepend(searchTitle);
}

CONTAINER.append(searchWrapper);
showPageTitle();
