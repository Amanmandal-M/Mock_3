// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const bookURL = `${baseServerURL}/books`;
let mainSection = document.getElementById("data-list-wrapper");

// book
let bookTitleInput = document.getElementById("book-title");
let bookImageInput = document.getElementById("book-image");
let bookCategoryInput = document.getElementById("book-category");
let bookAuthorInput = document.getElementById("book-author");
let bookPriceInput = document.getElementById("book-price");
let bookCreateBtn = document.getElementById("add-book");

// Update book
let updateBookIdInput = document.getElementById("update-book-id");
let updateBookTitleInput = document.getElementById("update-book-title");
let updateBookImageInput = document.getElementById("update-book-image");
let updateBookAuthorInput = document.getElementById("update-book-author");
let updateBookCategoryInput = document.getElementById("update-book-category");
let updateBookPriceInput = document.getElementById("update-book-price");
let updateBookBtn = document.getElementById("update-book");

//Update price
let updatePriceBookId = document.getElementById("update-price-book-id");
let updatePriceBookPrice = document.getElementById("update-price-book-price");
let updatePriceBookPriceButton = document.getElementById("update-price-book");

//sort and filter
let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");
let filterClassic = document.getElementById("filter-Classic");
let filterFantasy = document.getElementById("filter-Fantasy");
let filterMystery = document.getElementById("filter-Mystery");

//Search by title/author
let searchBySelect = document.getElementById("search-by-select");
let searchByInput = document.getElementById("search-by-input");
let searchByButton = document.getElementById("search-by-button");

//Books Data
let booksData = [];


//  ---------------->>>>>> On Page Load Data will shown in DOM <<<<<<----------------
window.addEventListener("load", () => {
  fetchedDataFromApi();
});


//  ---------------->>>>>> GET : fetch api and get data from server and calling Display function <<<<<<----------------
const fetchedDataFromApi = async () => {
  try {
    const apiResponse  = await fetch(bookURL);
    const responseData = await apiResponse.json();
    displayData(responseData);
    sortingData(responseData);
    filteredData(responseData);
  } catch (error) {
    console.log(error.message);
  }
};




//  ============================ >>>>>> Display data on DOM <<<<<< ============================
const displayData = (data) => {
  mainSection.innerHTML="";
  
  data.forEach(el => {
    let div1 = document.createElement("div");
    div1.className = "card-list";

    let div2 = document.createElement("div");
    div2.className = "card";
    div2.setAttribute("data-id", el.id);

    let imgDiv = document.createElement("div");
    imgDiv.className = "card-img";

    let image = document.createElement("img");
    image.src = el.image;
    image.alt = "book";

    let bodyDiv = document.createElement("div");
    bodyDiv.className = "card-body";

    let title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = el.title;

    let author = document.createElement("p");
    author.className = "card-author";
    author.textContent = el.author;

    let category = document.createElement("p");
    category.className = "card-category";
    category.textContent = el.category;

    let price = document.createElement("p");
    price.className = "card-price";
    price.textContent = el.price;

    let edit = document.createElement("a");
    edit.className="card-link"
    edit.href = "#";
    edit.setAttribute("data-id", el.id);
    edit.textContent = "Edit";

    edit.addEventListener('click', (e)=>{
      e.preventDefault();
      appendDataInDisplay(el.id);
      appendDataInDisplayOfPrice(el.id);
    })

    let deleteData = document.createElement("button");
    deleteData.className = "card-button";
    deleteData.setAttribute("data-id", el.id);
    deleteData.textContent = "Delete";

    deleteData.addEventListener('click',()=>{
      deleteBooks(el.id);
    })

    imgDiv.append(image);
    bodyDiv.append(title, author, category, price, edit, deleteData);
    div2.append(imgDiv, bodyDiv);
    div1.append(div2);

    mainSection.append(div1);
  });
};
//  ============================ >>>>>> Display data on DOM <<<<<< ============================




//  ---------------->>>>>> POST :  When you click this button then book add in API <<<<<<----------------
bookCreateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let obj = {
    "title": bookTitleInput.value,
    "author": bookAuthorInput.value,
    "category": bookCategoryInput.value,
    "image": bookImageInput.value,
    "price": bookPriceInput.value,
  };

  addBook(obj);
});
const addBook = async (data) => {
  try {
    const apiResponse = await fetch(bookURL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchedDataFromApi();
  } catch (error) {
    console.log(error.message);
  }
};


//  ---------------->>>>>> DELETE :  Delete Books form API <<<<<<----------------
const deleteBooks = async (id) => {
  try {
    const apiResponse = await fetch(`${bookURL}/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      }
    });
    fetchedDataFromApi();
  } catch (error) {
    console.log(error.message);
  }
};


//  ---------------->>>>>> PATCH :  Update all Books Data list  in API <<<<<<----------------
const appendDataInDisplay = async (id) => {
  try {
    const apiResponse = await fetch(`${bookURL}/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    });
    const apiResponseData = await apiResponse.json();

    updateBookIdInput.value = apiResponseData.id;
    updateBookTitleInput.value = apiResponseData.title;
    updateBookImageInput.value = apiResponseData.image;
    updateBookAuthorInput.value = apiResponseData.author;
    updateBookCategoryInput.value = apiResponseData.category;
    updateBookPriceInput.value = apiResponseData.price;

    updateBookInEdit();
  } catch (error) {
    console.log(error.message);
  }
};
const updateBookInEdit = () => {
  updateBookBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    let id = updateBookIdInput.value;
  
    let data = {
      "title": updateBookTitleInput.value,
      "author": updateBookAuthorInput.value,
      "category": updateBookCategoryInput.value,
      "image": updateBookImageInput.value,
      "price": updateBookPriceInput.value,
    };
  
    updateBook(id,data);
  })
};
const updateBook = async (id,data) => {
  try {
    const apiResponse = await fetch(`${bookURL}/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data)
    });
    fetchedDataFromApi();
  } catch (error) {
    console.log(error.message);
  }
};


//  ---------------->>>>>> PATCH :  Update Books Price Data list in API <<<<<<----------------
const appendDataInDisplayOfPrice = async (id) => {
  try {
    const apiResponse = await fetch(`${bookURL}/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    });
    const apiResponseData = await apiResponse.json();

    updatePriceBookId.value = apiResponseData.id
    updatePriceBookPrice.value = apiResponseData.price

    updateBookInEditByPrice();
  } catch (error) {
    console.log(error.message);
  }
};
const updateBookInEditByPrice = () => {
  updatePriceBookPriceButton.addEventListener("click", (e)=>{
    e.preventDefault();
    let id = updatePriceBookId.value;
  
    let data = {
      "price": updatePriceBookPrice.value,
    };
  
    updateBookByPrice(id,data);
  })
};
const updateBookByPrice = async (id,data) => {
  try {
    const apiResponse = await fetch(`${bookURL}/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data)
    });
    fetchedDataFromApi();
  } catch (error) {
    console.log(error.message);
  }
};


//  ---------------->>>>>> Sorting Data in A-Z && Z-A<<<<<<----------------
const sortingData = (data) => {

  // Ascending order
  sortAtoZBtn.addEventListener('click',()=>{
    const sortedData = data.sort((a,b)=>{return a.price - b.price});
    displayData(sortedData);
  })

  // Descending order
  sortZtoABtn.addEventListener('click',()=>{
    const sortedData = data.sort((a,b)=>{return b.price - a.price});
    displayData(sortedData);
  })
};


//  ---------------->>>>>> Filtering Data <<<<<<----------------
const filteredData = (data) => {

  // Classic Category
  filterClassic.addEventListener('click', (e) => {
    const filteredData = data.filter((el)=>{return el.category=="Classic"})
    displayData(filteredData);
  })

  // Fantasy Category
  filterFantasy.addEventListener('click', (e) => {
    const filteredData = data.filter((el)=>{return el.category=="Fantasy"});
    displayData(filteredData);
  })

  // Mystery Category
  filterMystery.addEventListener('click', (e) => {
    const filteredData = data.filter((el)=>{return el.category=="Mystery"});
    displayData(filteredData);
  })

};


//  ---------------->>>>>> Searching Data by author or title<<<<<<----------------
searchByButton.addEventListener("click",(e)=>{
  e.preventDefault();
  searchingData();
});
const searchingData = () => {

  // Search With Title
  const searchByTitle = async () => {
    try {
      const apiResponse = await fetch(`${bookURL}?title_like=${searchByInput.value}`);
      const dataOfResponse = await apiResponse.json();
      displayData(dataOfResponse);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Search With Author
  const searchByAuthor = async () => {
    try {
      const apiResponse = await fetch(`${bookURL}?author_like=${searchByInput.value}`)
      const dataOfResponse = await apiResponse.json()
      displayData(dataOfResponse);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  searchBySelect.value=="title" ? searchByTitle() : searchByAuthor();
};


