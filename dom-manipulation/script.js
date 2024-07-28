
const quoteDisplay = document.getElementById("quoteDisplay");
const showQuoteButton = document.getElementById("newQuote");


let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" }
]

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedFilter = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastSelectedFilter;
    filterQuotes();
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = randomQuote.text;
}

function createAddQuoteForm() {
    const quoteForm = document.createElement("div");
    quoteForm.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `
    document.body.appendChild(quoteForm);
}

function addQuote() {
    const quote = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (quote && category) {
        const quoteObject = {
            text: quote,
            category: category
        }
        quotes.push(quoteObject);
        document.getElementById("newQuoteText").value = ""
        document.getElementById("newQuoteCategory").value = ""
    } else {
        alert("Please enter both quote and category")
    }
}


function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    fetchQuotesFromServer();
}

function exportToJsonFile() {
    const dataString = JSON.stringify(quotes);
    const dataBlob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'quotes.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();
        quotes = serverQuotes;
        saveQuotes();
        showNotification('Quotes synced with server');
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

async function postQuotesToServer(params) {
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes)
        });
        console.log('Data successfully posted to server');
    } catch (error) {
        console.error('Error posting to server:', error);
    }
}

async function syncQuotes(params) {
    try {
        const serverQuotes = await fetchQuotesFromServer();

        if (serverQuotes.length > 0) {
            quotes = serverQuotes;
            saveQuotes();
            populateCategories();
            showNotification('Quotes synced with server!');
        }

        await postQuotesToServer();
    } catch (error) {
        console.error('Error syncing quotes:', error);
        showNotification('Error syncing quotes. Please try again.');
    }
}

function startPeriodicSync() {
    setInterval(fetchQuotesFromServer, 60000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

showQuoteButton.addEventListener("click", showRandomQuote);
createAddQuoteForm();

const exportButton = document.getElementById("exportQuotes");
exportButton.onclick = exportToJsonFile;
document.body.appendChild(exportButton);

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.id = 'importFile';
importInput.accept = '.json';
importInput.onchange = importFromJsonFile;
document.body.appendChild(importInput);


startPeriodicSync();
populateCategories()
