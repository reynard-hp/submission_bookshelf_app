// Kode oleh Reynard Hans P
// Sebagai submission Bookshelf Apps dari Dicoding
const books = [];
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searchResultContainer = document.getElementById(
    "searchResultContainer"
  );
  searchResultContainer.style.display = "none";

  const inputSearch = document.getElementById("searchBook");
  inputSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("searchResult").innerHTML = "";
    document.getElementById("searchResultContainer").style.display = "";
    searchBook();
  });
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const generatedID = generateId();

  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    penulis,
    bookYear,
    false
  );

  const inputIsComplete = document.getElementById("inputBookIsComplete");
  if (inputIsComplete.checked) {
    bookObject.isComplete = true;
  } else {
    bookObject.isComplete = false;
  }

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete == true) completedBookList.append(bookElement);
    else uncompletedBookList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");

  if (bookObject.isComplete) {
    greenButton.innerText = "Belum selesai di Baca";
    greenButton.addEventListener("click", function () {
      removeBookfromComplete(bookObject.id);
    });
  } else {
    greenButton.innerText = "Selesai dibaca";
    greenButton.addEventListener("click", function () {
      addBooktoComplete(bookObject.id);
    });
  }

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  buttonContainer.append(greenButton, redButton);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textAuthor, textYear, buttonContainer);

  return article;
}

function addBooktoComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookfromComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

//Filter Function
function searchBook() {
  const newText = document.createElement("h2");
  newText.innerText = "Hasil Pencarian";
  searchResult = document.getElementById("searchResult");
  searchResult.appendChild(newText);

  const titleInput = document.getElementById("searchBookTitle").value;

  const result = books.filter((book) => {
    const bookTitle = book.title.toLowerCase();
    const searchKeyword = titleInput.toLowerCase();

    return bookTitle.includes(searchKeyword);
  });

  if (result.length === 0) {
    const notFound = document.createElement("h3");
    notFound.innerText = "Tidak ada buku yang dicari";
    notFound.classList.add("notFoundText");
    searchResult.appendChild(notFound);
  }

  for (item of result) {
    bookSearched = makeSearchedBook(item);
    searchResult.append(bookSearched);
  }
}

function makeSearchedBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const status = document.createElement("p");
  status.classList.add("keterangan");
  if (bookObject.isComplete) {
    status.innerText += "Sudah dibaca";
    status.style.backgroundColor = "darkgreen";
  } else {
    status.innerText += "Belum dibaca";
    status.style.backgroundColor = "darkred";
  }

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textAuthor, textYear, status);

  return article;
}

//Storage
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
