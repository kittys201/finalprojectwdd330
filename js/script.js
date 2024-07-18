document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const query = document.getElementById('searchQuery').value;
    searchBooks(query);
});

document.getElementById('addForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const volumeId = document.getElementById('volumeId').value;
    const bookshelfId = document.getElementById('bookshelfId').value;
    
    addVolumeToBookshelf(volumeId, bookshelfId);
});

const searchBooks = async (query) => {
    const url = `https://googlebooksraygorodskijv1.p.rapidapi.com/search?q=${query}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f0cecd18bbmsh5b039bfdc1ef1bfp1da1e1jsn7303904267b4',
            'x-rapidapi-host': 'GoogleBooksraygorodskijV1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        displaySearchResults(result);
    } catch (error) {
        console.error(error);
    }
};

const displaySearchResults = (results) => {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    const volumeSelect = document.getElementById('volumeId');
    volumeSelect.innerHTML = '';

    results.items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.volumeInfo.title} by ${item.volumeInfo.authors.join(', ')}`;
        volumeSelect.appendChild(option);
    });

    document.getElementById('addForm').style.display = 'block';
    listBookshelves();
};

const listBookshelves = async () => {
    const url = `https://googlebooksraygorodskijv1.p.rapidapi.com/mylibrary/bookshelves`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f0cecd18bbmsh5b039bfdc1ef1bfp1da1e1jsn7303904267b4',
            'x-rapidapi-host': 'GoogleBooksraygorodskijV1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        displayBookshelves(result);
    } catch (error) {
        console.error(error);
    }
};

const displayBookshelves = (bookshelves) => {
    const bookshelfSelect = document.getElementById('bookshelfId');
    bookshelfSelect.innerHTML = '';

    bookshelves.items.forEach(bookshelf => {
        const option = document.createElement('option');
        option.value = bookshelf.id;
        option.textContent = bookshelf.title;
        bookshelfSelect.appendChild(option);
    });
};

const addVolumeToBookshelf = async (volumeId, bookshelfId) => {
    const url = `https://googlebooksraygorodskijv1.p.rapidapi.com/addVolumeToBookshelf`;
    const data = new FormData();
    data.append('volumeId', volumeId);
    data.append('bookshelfId', bookshelfId);
    
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'f0cecd18bbmsh5b039bfdc1ef1bfp1da1e1jsn7303904267b4',
            'x-rapidapi-host': 'GoogleBooksraygorodskijV1.p.rapidapi.com'
        },
        body: data
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        document.getElementById('response').textContent = result;
    } catch (error) {
        console.error(error);
        document.getElementById('response').textContent = 'Ocurrió un error al agregar el libro a la estantería.';
    }
};