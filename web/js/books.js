let addBookEvent = function(){
    let bookListEl = document.querySelector("ul.books");
    bookListEl.addEventListener("click", function(e){
        console.log("click");
        if(
            e.target.tagName === "BUTTON" &&
            e.target.classList.contains("delete")
        ){
            let bookId = e.target.parentElement.parentElement.dataset.id;
            deleteBook(bookId);
        } else if (
            e.target.tagName === "A" &&
            e.target.classList.contains("details")
        ) {
            let divEl = e.target.parentElement.parentElement.querySelector("div");
            if (divEl.classList.contains("hide")) { //
                let bookId = e.target.parentElement.parentElement.dataset.id;
                loadBook(bookId);
            } else {
                divEl.classList.add("hide");
                // divEl.children.forEach(el => divEl.removeChild(el));
            }
        } else if (
            e.target.tagName === "BUTTON" &&
            e.target.classList.contains("edit")
        ) {
            let pEl = e.target.parentElement.parentElement.querySelector("p.edit");
            if (pEl.classList.contains("hide")) {
                let bookId = e.target.parentElement.parentElement.dataset.id;
                editBook(bookId);
            } else {
                pEl.classList.add("hide");
                // divEl.children.forEach(el => divEl.removeChild(el));
            }
        } else if (
            e.target.type === "submit" &&
            e.target.parentElement.parentElement.classList.contains("edit")
        ) {
            let bookId = e.target.parentElement.parentElement.parentElement.dataset.id;
            let bookAuthor = e.target.parentElement.querySelector("[name='author']").value;
            let bookTitle = e.target.parentElement.querySelector("[name='title']").value;
            let bookIsbn = e.target.parentElement.querySelector("[name='isbn']").value;
            let bookPublisher = e.target.parentElement.querySelector("[name='publisher']").value;
            let bookType = e.target.parentElement.querySelector("[name='type']").value;

            let book = {
                id: bookId,
                title: bookTitle,
                author: bookAuthor,
                isbn: bookIsbn,
                publisher: bookPublisher,
                type: bookType
            };
            updBook(book);
        }
    })
};

let addNewBookEvent = function() {
    let form = document.querySelector("form.new_book");
    form.addEventListener("submit", function(e){
        e.preventDefault();
        let bookAuthor = this.querySelector("[name=author]").value;
        let bookTitle = this.querySelector("[name=title]").value;
        let bookIsbn = this.querySelector("[name=isbn]").value;

        let book = {
            title: bookTitle,
            author: bookAuthor,
            isbn: bookIsbn
        };
        saveNewBook(book);
    });
};

let deleteBook = function(bookId){
    $.ajax({
        url: "http://localhost:8080/books/"+bookId,
        method: "DELETE",
        dataType: "text"
    }).done(function(){
        let bookElem = document.querySelector('ul.books li[data-id="' + bookId + '"]');
        bookElem.remove();
    }).fail(function (err) {
        console.log(err);
    })
}

let saveNewBook = function(book){
    $.ajax({
        url: "http://localhost:8080/books",
        method: "POST",
        data: JSON.stringify(book),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: "json"
    }).done(function(book){
        let bookListEl =document.querySelector("ul.books");
        createBookListElem(book, bookListEl);
    }).fail(function (err) {
        console.log(err);
    })
}

let loadBooks = function(){
    $.ajax({
        url: "http://localhost:8080/books",
        method: "GET",
        dataType: "json"
    }).done(function(booksArray){
        let bookListEl = document.querySelector("ul.books");
        booksArray.forEach( book => {
            createBookListElem(book, bookListEl);
    })
    }).fail(function (err) {
        console.log(err);
    })
};

let loadBook = function(bookId) {
    $.ajax({
        url: "http://localhost:8080/books/"+bookId,
        method: "GET",
        dataType: "json"
    }).done(function(book){
        // let bookElem = document.querySelector(`ul.books li[data-id='${bookId}']`);
        showBook(book);
    }).fail(function (err) {
        console.log(err);
    })
}

let editBook = function(bookId){
    $.ajax({
        url: "http://localhost:8080/books/"+bookId,
        method: "GET",
        dataType: "json"
    }).done(function(book){
        showEditForm(book);
    }).fail(function (book) {
        console.log(err);
    })
}

let updBook = function(book){
    $.ajax({
        url: "http://localhost:8080/books/"+book.id,
        method: "PUT",
        data: JSON.stringify(book),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: "text"
    }).done(function(){
        alert('PUT completed');
        loadBooks();
    }).fail(function (err) {
        console.log(err);
    })
}

let showBook = function(book)  {
    let bookElem = document.querySelector("ul.books li[data-id='"+book.id+"']");
    let detEl = bookElem.querySelector("div");
    let titleEl = detEl.querySelector("p.title");
    titleEl.innerText = "Title: " + book.title;
    let authorEl = detEl.querySelector("p.author");
    authorEl.innerText = "Author: " + book.author;
    let publisherEl = detEl.querySelector("p.publisher");
    publisherEl.innerText = "Publisher: " + book.publisher;
    let typeEl = detEl.querySelector("p.type");
    typeEl.innerText = "Type: " + book.type;
    let isbnEl = detEl.querySelector("p.isbn");
    isbnEl.innerText = "Isbn: " + book.isbn;
    detEl.classList.remove("hide");
};

let showEditForm = function(book)  {
    let bookElem = document.querySelector(`ul.books li[data-id='${book.id}']`);
    let pEl = bookElem.querySelector("p.edit");
    let formEl = pEl.querySelector("form");
    let titleEl = formEl.querySelector("input[name='title']");
    titleEl.value = book.title;
    let authorEl = formEl.querySelector("input[name='author']");
    authorEl.value = book.author;
    let publisherEl = formEl.querySelector("input[name='publisher']");
    publisherEl.value = book.publisher;
    let typeEl = formEl.querySelector("input[name='type']");
    typeEl.value = book.type;
    let isbnEl = formEl.querySelector("input[name='isbn']");
    isbnEl.value = book.isbn;
    pEl.classList.remove("hide");
};

let createBookListElem = function(book, bookListElem){

    let createRow = function(lb, name, table) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        let tdLabel = document.createElement("td");
        tdLabel.innerText = lb;
        tr.appendChild(tdLabel);
        let tdText = document.createElement("td");
        let input = document.createElement("input");
        input.type = "text";
        input.name = name;
        tdText.appendChild(input);
        tr.appendChild(tdText);
    }

    let liElem = document.createElement("li");
    liElem.dataset.id = book.id;

    let h3Elem = document.createElement("h3");

    let linkEl = document.createElement("a");
    linkEl.classList.add("details");
    linkEl.href = "#";
    linkEl.innerText = book.title;
    h3Elem.appendChild(linkEl);
    // h3Elem.innerText = book.title;
    liElem.appendChild(h3Elem);

    let detailsDiv = document.createElement("div");
    // detailsDiv.innerText = "div";
    detailsDiv.classList.add("hide");
    let titleEl = document.createElement("p");
    titleEl.classList.add("title");
    detailsDiv.appendChild(titleEl);
    let authorEl = document.createElement("p");
    authorEl.classList.add("author");
    detailsDiv.appendChild(authorEl);
    let publisherEl = document.createElement("p");
    publisherEl.classList.add("publisher");
    detailsDiv.appendChild(publisherEl);
    let isbnEl = document.createElement("p");
    isbnEl.classList.add("isbn");
    detailsDiv.appendChild(isbnEl);
    let typeEl = document.createElement("p");
    typeEl.classList.add("type");
    detailsDiv.appendChild(typeEl);
    liElem.appendChild(detailsDiv);

    let buttonsSection = document.createElement("section");
    buttonsSection.classList.add("links");

    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit");
    buttonsSection.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete");
    buttonsSection.appendChild(deleteButton);

    liElem.appendChild(buttonsSection);

    let pEdit = document.createElement("p");
    let editForm = document.createElement("form");
    pEdit.classList.add("edit");

    let table = document.createElement("table");
    editForm.appendChild(table);
    createRow("Title:", "title", table);
    createRow("Author:", "author", table);
    createRow("Publisher:", "publisher", table);
    createRow("Isbn:", "isbn", table);
    createRow("Type:", "type", table);
    let submit = document.createElement("input");
    submit.type = "submit";
    editForm.appendChild(submit);
    pEdit.classList.add("hide");

    pEdit.appendChild(editForm);
    liElem.appendChild(pEdit);

    bookListElem.append(liElem);
};