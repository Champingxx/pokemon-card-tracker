// script.js - JavaScript for the Pokémon Card Collection Tracker with expanded card database

// Function to fetch all card data
async function fetchAllCardData() {
  try {
    const response = await fetch('https://api.pokemontcg.io/v2/cards?q=rarity:"Illustration Rare" OR rarity:"Special Illustration Rare"&orderBy=set.releaseDate,number&pageSize=250');
    const data = await response.json();
    
    // Transform the data to our format
    return data.data.map(card => ({
      id: card.id,
      name: card.name,
      number: card.number,
      set: card.set.name,
      set_id: card.set.id,
      rarity: card.rarity,
      image_url: card.images.small,
      types: card.types || [],
      owned: false
    }));
  } catch (error) {
    console.error('Error fetching card data:', error);
    // Return sample data as fallback
    return sampleCardData;
  }
}

// Sample card data as fallback
const sampleCardData = [
  // ... (existing sample card data)
];

// DOM elements
const totalCardsElement = document.getElementById('total-cards');
const ownedCardsElement = document.getElementById('owned-cards');
const completionElement = document.getElementById('completion');
const setFilterElement = document.getElementById('set-filter');
const ownershipFilterElement = document.getElementById('ownership-filter');
const cardCountElement = document.getElementById('card-count');
const loadingMessageElement = document.getElementById('loading-message');
const noCardsMessageElement = document.getElementById('no-cards-message');
const cardsGridElement = document.getElementById('cards-grid');

// State
let cards = [];
let filteredCards = [];
let sets = [];
let filters = {
  setId: 'all',
  owned: 'all'
};

// Initialize the app
async function initializeApp() {
  // Show loading message
  loadingMessageElement.style.display = 'block';
  
  try {
    // Fetch all card data
    const cardData = await fetchAllCardData();
    
    // Load ownership data from localStorage
    const ownedCards = JSON.parse(localStorage.getItem('ownedCards') || '{}');
    
    // Add owned property to each card
    cards = cardData.map(card => ({
      ...card,
      owned: ownedCards[card.id] || false
    }));
    
    filteredCards = [...cards];
    
    // Extract unique sets
    const uniqueSets = [...new Set(cards.map(card => card.set_id))];
    sets = uniqueSets.map(setId => {
      const setName = cards.find(card => card.set_id === setId)?.set || setId;
      return { id: setId, name: setName };
    });
    
    // Sort sets alphabetically by name
    sets.sort((a, b) => a.name.localeCompare(b.name));
    
    // Populate set filter
    populateSetFilter();
    
    // Update stats
    updateStats();
    
    // Render cards
    renderCards();
    
    // Add event listeners
    setFilterElement.addEventListener('change', handleSetFilterChange);
    ownershipFilterElement.addEventListener('change', handleOwnershipFilterChange);
    
    // Hide loading message
    loadingMessageElement.style.display = 'none';
  } catch (error) {
    console.error('Error initializing app:', error);
    loadingMessageElement.textContent = 'Error loading card data. Please try refreshing the page.';
  }
}

// Populate set filter
function populateSetFilter() {
  sets.forEach(set => {
    const option = document.createElement('option');
    option.value = set.id;
    option.textContent = set.name;
    setFilterElement.appendChild(option);
  });
}

// Update stats
function updateStats() {
  const totalCards = cards.length;
  const ownedCards = cards.filter(card => card.owned).length;
  const completion = totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0;
  
  totalCardsElement.textContent = totalCards;
  ownedCardsElement.textContent = ownedCards;
  completionElement.textContent = `${completion}%`;
}

// Filter cards
function filterCards() {
  filteredCards = cards.filter(card => {
    // Filter by set
    if (filters.setId !== 'all' && card.set_id !== filters.setId) {
      return false;
    }
    
    // Filter by ownership
    if (filters.owned === 'owned' && !card.owned) {
      return false;
    }
    
    if (filters.owned === 'not-owned' && card.owned) {
      return false;
    }
    
    return true;
  });
  
  renderCards();
}

// Render cards
function renderCards() {
  // Update card count
  cardCountElement.textContent = filteredCards.length;
  
  // Clear cards grid
  cardsGridElement.innerHTML = '';
  
  // Show/hide no cards message
  if (filteredCards.length === 0) {
    noCardsMessageElement.style.display = 'block';
    return;
  } else {
    noCardsMessageElement.style.display = 'none';
  }
  
  // Render each card
  filteredCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    
    const cardHTML = `
      <div class="card-image-container">
        ${card.image_url ? 
          `<img src="${card.image_url}" alt="${card.name}" class="card-image">` : 
          `<div class="card-image-placeholder"><span>No Image</span></div>`
        }
      </div>
      <div class="card-details">
        <h3 class="card-name">${card.name}</h3>
        <p class="card-number">${card.number} · ${card.set}</p>
        <p class="card-rarity">${card.rarity}</p>
        <button class="ownership-button ${card.owned ? 'owned' : ''}" data-card-id="${card.id}">
          ${card.owned ? '✓ Owned' : 'Mark as Owned'}
        </button>
      </div>
    `;
    
    cardElement.innerHTML = cardHTML;
    cardsGridElement.appendChild(cardElement);
    
    // Add event listener to ownership button
    const button = cardElement.querySelector('.ownership-button');
    button.addEventListener('click', handleOwnershipButtonClick);
  });
}

// Handle set filter change
function handleSetFilterChange(event) {
  filters.setId = event.target.value;
  filterCards();
}

// Handle ownership filter change
function handleOwnershipFilterChange(event) {
  filters.owned = event.target.value;
  filterCards();
}

// Handle ownership button click
function handleOwnershipButtonClick(event) {
  const cardId = event.target.dataset.cardId;
  
  // Update card ownership
  cards = cards.map(card => 
    card.id === cardId ? { ...card, owned: !card.owned } : card
  );
  
  // Update localStorage
  const ownedCards = cards.reduce((acc, card) => {
    if (card.owned) {
      acc[card.id] = true;
    }
    return acc;
  }, {});
  
  localStorage.setItem('ownedCards', JSON.stringify(ownedCards));
  
  // Update stats
  updateStats();
  
  // Re-filter cards
  filterCards();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
