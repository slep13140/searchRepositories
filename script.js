const searchWrapper = document.querySelector(".search-box__input-box");
const inputBox = searchWrapper.querySelector("input");
const autocomBox = searchWrapper.querySelector(".search-box__autocom");
const resultElement = document.querySelector(".search-box__result-box");

inputBox.addEventListener("keyup", debounce(searchEvent, 500));

autocomBox.addEventListener("click", function (evt) {
  let targetChange = evt.target.closest("li");
  resultElement.append(createElementRepo(targetChange));
  autocomBox.classList.remove("active");
  inputBox.value = "";
});

resultElement.addEventListener("click", function (evt) {
  let targetClose = evt.target.closest("button");
  if (!targetClose) {
    return;
  } else {
    targetClose.closest("li").remove();
  }
});

function searchEvent(evt) {
  let repoData = evt.target.value;
  if (repoData) {
    searchRepo(repoData).then((repoElem) => {
      autocomBox.classList.add("active");
      showRepositories(repoElem);
    });
  } else {
    autocomBox.classList.remove("active");
  }
}

async function searchRepo(el) {
  let objRepo = await fetch(
    `https://api.github.com/search/repositories?q=${el}&per_page=5`
  );
  const resultSearch = await objRepo.json();
  let repoElements = resultSearch.items.map((user) => {
    let newObjRepo = {};
    newObjRepo.name = user.name;
    newObjRepo.login = user.owner.login;
    newObjRepo.stars = user.stargazers_count;
    return newObjRepo;
  });
  return repoElements;
}

function showRepositories(list) {
  let listData;
  let newDataArr;
  if (!list.length) {
    userValue = inputBox.value;
    listData = "<li>" + userValue + "</li>";
  } else {
    newDataArr = list.map((item) => {
      return `<li data-login=${item.login} data-stars=${item.stars}>${item.name}</li>`;
    });
    listData = newDataArr.join("");
  }
  autocomBox.innerHTML = listData;
}

function createElement(elementTag, elementText) {
  const element = document.createElement(elementTag);
  if (elementText) {
    element.textContent = elementText;
  }
  return element;
}

function createElementRepo(elem) {
  let listName = createElement("li");
  let listContent = createElement("div");
  let listSpanName = createElement("span", `Name: ${elem.textContent}`);
  let listSpanOwner = createElement("span", `Owner: ${elem.dataset.login}`);
  let listSpanStars = createElement("span", `Stars: ${elem.dataset.stars}`);
  let listButtonClose = createElement("button");
  listContent.append(listSpanName);
  listContent.append(listSpanOwner);
  listContent.append(listSpanStars);
  listName.classList.add("search-box__result-element");
  listName.append(listContent);
  listName.append(listButtonClose);
  return listName;
}

function debounce(fn, debounceTime) {
  let timerId;
  return function (...arg) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, arg), debounceTime);
  };
}
