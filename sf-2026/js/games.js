/**
 * Fetches and displays random games from PlayWiki.Games
 */

const GAMES_JSON_URL = 'https://playwiki.games/games.json';
const NUM_GAMES_TO_DISPLAY = 6;

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creates HTML for a game card
 */
function createGameCard(game) {
  // Build author HTML
  let authorsHTML = '<div class="authors-list">';

  if (game.author) {
    // Split author by common delimiters (comma, ampersand, "and")
    const authors = game.author
      .split(/,|&|\sand\s/)
      .map(a => a.trim())
      .filter(a => a.length > 0);

    authors.forEach(author => {
      authorsHTML += `<span class="author-name">${author}</span>`;
    });
  }

  authorsHTML += '</div>';

  // Build game card HTML
  const card = document.createElement('div');
  card.className = 'game-card';

  // Construct the preview image URL
  const previewUrl = game.preview
    ? `https://playwiki.games/previews/${game.preview}`
    : '../img/placeholder.png';

  card.innerHTML = `
    <div class="game-screenshot-container">
      <img src="${previewUrl}" alt="${game.name} Screenshot" class="game-screenshot" onerror="this.style.display='none';">
    </div>
    <div class="game-content">
      <h3>${game.name}</h3>
      <div class="game-authors">
        ${authorsHTML}
      </div>
      <p class="game-description">${game.description}</p>
      <div class="game-links">
        <a href="${game.url}" target="_blank" rel="noopener" class="game-link play-link">
          🎮 Play Game
        </a>
      </div>
    </div>
  `;

  return card;
}

/**
 * Fetches games and populates the grid
 */
async function loadRandomGames() {
  try {
    const response = await fetch(GAMES_JSON_URL);
    const data = await response.json();

    if (!data.games || !Array.isArray(data.games)) {
      throw new Error('Invalid games data structure');
    }

    // Filter to only available games
    const availableGames = data.games.filter(game => game.status === 'available');

    // Shuffle and take the first NUM_GAMES_TO_DISPLAY
    const randomGames = shuffleArray(availableGames).slice(0, NUM_GAMES_TO_DISPLAY);

    // Get the games grid container
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) {
      console.error('Games grid container not found');
      return;
    }

    // Clear existing content
    gamesGrid.innerHTML = '';

    // Add game cards
    randomGames.forEach(game => {
      const card = createGameCard(game);
      gamesGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading games:', error);
    const gamesGrid = document.querySelector('.games-grid');
    if (gamesGrid) {
      gamesGrid.innerHTML = '<p style="text-align: center; color: #ffd1dc;">Unable to load games at this time.</p>';
    }
  }
}

// Load games when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadRandomGames);
} else {
  loadRandomGames();
}
