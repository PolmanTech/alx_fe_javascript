document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
});

// Elements selection
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportQuotesBtn = document.getElementById('exportQuotes');

// Initial quotes object
let quoteObjects = [
    { quote: "text", category: "category" },
    { quote: "We do not remember days, we remember moments.", category: "Life" },
    { quote: "Without music, life would be a mistake.", category: "Music" },
    { quote: "Give light and people will find the way.", category: "Inspirational" },
    { quote: "It is better to learn late than never.", category: "Education" },
];

// Show Random Quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quoteObjects.length);
    const randomQuote = quoteObjects[randomIndex];
    displayQuote(randomQuote);
}

// Function to display quotes 
function displayQuote(quote) {
    const quotePara = document.createElement("p");
    const categoryPara = document.createElement("p");

    // Add content
    quotePara.innerHTML = quote["quote"];
    categoryPara.innerHTML = quote["category"];

    // Style
    quotePara.style.fontStyle = "italic";
    categoryPara.style.fontWeight = "bold";

    // append
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quotePara);
    quoteDisplay.appendChild(categoryPara);
}

showRandomQuote();

const createAddQuoteForm = () => {
    // Add New Quote
    if (newQuoteTextInput.value !== "" && newQuoteCategoryInput.value !== "") {
        const newQuoteText = newQuoteTextInput.value;
        const newQuoteCategory = newQuoteCategoryInput.value;

        const newQuote = { quote: newQuoteText, category: newQuoteCategory };

        // Add to the object array
        quoteObjects.push(newQuote);

        // Save to local storage
        saveQuotes();

        // Show new quote when button is clicked
        newQuoteBtn.addEventListener('click', () => {
            // Show new quote
            displayQuote(newQuote);
        });

        // clear the inputs
        newQuoteTextInput.value = "";
        newQuoteCategoryInput.value = "";
    } else {
        alert("Fill both quote and category fields!");
    }

}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("Quotes", JSON.stringify(quoteObjects));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("Quotes")) || [];
    quoteObjects = storedQuotes.length ? storedQuotes : quoteObjects;
}

// Export quotes to JSON file
exportQuotesBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(quoteObjects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
});

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quoteObjects.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}