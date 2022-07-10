"use strict";

const usersSubcategory = [
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
];
const postsSubcategory = ["title", "body"];
const commentsSubcategory = ["name", "email", "body"];
const albumsSubcategory = ["title"];
const photosSubcategory = ["title"];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchCatergory = urlParams.get("_category");
const searchPhrase = urlParams.get("_like");

if (searchCatergory === "users") {
  usersSubcategory.map((q) => {
    fetch(`${USER_ENDPOINT}/?${q}_like=${searchPhrase}`)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(q);
        console.dir(data);
      });
  });
}
