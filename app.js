function customHttp() {
  get();
}

async function get(url, cb) {
  try {
    const response = await fetch(url)
      .then((res) => res.json())
      .then((post) => {
        cb(null, post);
        return post;
      });
    return response;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = "fd646d5382ba43949f962f098505a0ef";
  const apiUrl = "https://news-api-v2.herokuapp.com";

  return {
    topHeadlines(country = "ua", category = "sport", cb) {
      get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchInput = form.elements["search"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const searchText = searchInput.value;
  const category = categorySelect.value;

  if (!searchText) {
    newsService.topHeadlines(country, category, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

function onGetResponse(err, res) {
  removeLoader();
  if (err) {
    showAlert(err, "error-msg");
    return;
  }

  if (!res.articles.length) {
    const newsContainer = document.querySelector(".news-container .row");
    clearContainer(newsContainer);
    alert("Данной информации нет");
    return;
  }

  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = "";

  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function newsTemplate({ urlToImage, title, url, description }) {
  const sImage = "https://24tv.ua/resources/photos/news/202006/1365703.jpg";
  return `
      <div class='col s12'>
        <div class='card'>
          <div class='card-image'>
            <img src='${urlToImage || sImage}'>
            <span class='card-title'>${title || ""}</span>
          </div>
          <div class='card-content'>
            <p>${description || ""}</p>
          </div>
          <div class="card-action">
            <a href='${url}'>Read more</a>
          </div>
        </div>
      </div>
    `;
}

function showAlert(msg, type = "success") {
  M.toast({ html: msg, classes: type });
}

function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

function showLoader() {
  document.body.insertAdjacentHTML(
    "beforebegin",
    `<div class="progress">
          <div class="indeterminate"></div>
       </div>`
  );
}

function removeLoader() {
  const loader = document.querySelector(".progress");
  if (loader) {
    loader.remove();
  }
}

// function customHttp() {
//   return {
//     get(url, cb) {
//       try {
//         const response = fetch(url)
//           .then((res) => res.json())
//           .then((post) => {
//             cb(null, post);
//             return post;
//           });
//         return response;
//       } catch (err) {
//         console.log(err);
//         return Promise.reject(err);
//       }
//     },
//   };
// }
// // Init http module
// const http = customHttp();

// const newsService = (function () {
//   const apiKey = "fd646d5382ba43949f962f098505a0ef";
//   const apiUrl = "https://news-api-v2.herokuapp.com";

//   return {
//     topHeadlines(country = "ua", category = "sport", cb) {
//       http.get(
//         `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
//         cb
//       );
//     },
//     everything(query, cb) {
//       http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
//     },
//   };
// })();

// const form = document.forms["newsControls"];
// const countrySelect = form.elements["country"];
// const categorySelect = form.elements["category"];
// const searchInput = form.elements["search"];

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   loadNews();
// });

// //  init selects
// document.addEventListener("DOMContentLoaded", function () {
//   M.AutoInit();
//   loadNews();
// });

// function loadNews() {
//   showLoader();
//   const country = countrySelect.value;
//   const searchText = searchInput.value;
//   const category = categorySelect.value;

//   if (!searchText) {
//     newsService.topHeadlines(country, category, onGetResponse);
//   } else {
//     newsService.everything(searchText, onGetResponse);
//   }
// }

// function onGetResponse(err, res) {
//   removeLoader();
//   if (err) {
//     showAlert(err, "error-msg");
//     return;
//   }

//   if (!res.articles.length) {
//     const newsContainer = document.querySelector(".news-container .row");
//     clearContainer(newsContainer);
//     alert("Данной информации нет");
//     return;
//   }

//   renderNews(res.articles);
// }

// function renderNews(news) {
//   const newsContainer = document.querySelector(".news-container .row");
//   if (newsContainer.children.length) {
//     clearContainer(newsContainer);
//   }
//   let fragment = "";

//   news.forEach((newsItem) => {
//     const el = newsTemplate(newsItem);
//     fragment += el;
//   });

//   newsContainer.insertAdjacentHTML("afterbegin", fragment);
// }

// function newsTemplate({ urlToImage, title, url, description }) {
//   const sImage = "https://24tv.ua/resources/photos/news/202006/1365703.jpg";
//   return `
//       <div class='col s12'>
//         <div class='card'>
//           <div class='card-image'>
//             <img src='${urlToImage || sImage}'>
//             <span class='card-title'>${title || ""}</span>
//           </div>
//           <div class='card-content'>
//             <p>${description || ""}</p>
//           </div>
//           <div class="card-action">
//             <a href='${url}'>Read more</a>
//           </div>
//         </div>
//       </div>
//     `;
// }

// function showAlert(msg, type = "success") {
//   M.toast({ html: msg, classes: type });
// }

// function clearContainer(container) {
//   let child = container.lastElementChild;
//   while (child) {
//     container.removeChild(child);
//     child = container.lastElementChild;
//   }
// }

// function showLoader() {
//   document.body.insertAdjacentHTML(
//     "beforebegin",
//     `<div class="progress">
//           <div class="indeterminate"></div>
//        </div>`
//   );
// }

// function removeLoader() {
//   const loader = document.querySelector(".progress");
//   if (loader) {
//     loader.remove();
//   }
// }
