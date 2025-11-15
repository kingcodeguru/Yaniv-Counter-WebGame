/**
 * Yaniv Counter Application Script
 * Purpose: Manages player creation, point tracking, and sorting/placement updates.
 */

// ===================================
// 1. Player Class Definition
// ===================================
class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
    }

    addPoints(toAdd) {
        this.points += toAdd;
        // Logic for reducing points if divisible by 50 (Yaniv rule)
        if (this.points % 50 === 0) {
            this.points -= 50;
        }
    }
}

// ===================================
// 2. Global State Variables
// ===================================
let players = []; // Stores the Player objects
let cellIndexCounter = 0; // Simple counter for unique DOM element IDs

// ===================================
// 3. Main Application Setup and Event Handlers
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const playerList = document.getElementById('playerList');
    const nameInput = document.getElementById('getName');
    const addPlayerButton = document.getElementById('addPlayer');
    const sumButton = document.querySelector('.sum-player-points'); 

    // --- Add Player Listener ---
    if (addPlayerButton) {
        addPlayerButton.addEventListener('click', () => {
            const nameValue = nameInput.value.trim();

            if (nameValue === "") {
                alert("Please enter a player's name."); 
                return;
            }
            
            // A. Logic: Create player object
            const newP = new Player(nameValue);
            players.push(newP);
            
            // B. DOM: Create and add the player cell
            // We use the current array length for the initial placement index
            redrawPlayerCell(newP, players.length, playerList); 
            
            // C. Cleanup
            nameInput.value = '';
            console.log('Current Players:', players); 
        });
    }

    // --- SUM Points Listener ---
    if (sumButton) {
        sumButton.addEventListener('click', () => {
            handleSumPoints(playerList);
        });
    }
});

// ===================================
// 4. Core Logic: SUM Points
// ===================================
function handleSumPoints(playerList) {
    console.log('--- SUM Button Clicked! Calculating points... ---');

    // 1. Iterate through ALL currently displayed cells to read input
    const cells = playerList.querySelectorAll('.cell');

    cells.forEach((cell) => {
        const inputElement = cell.querySelector('.input-points');
        const nameElement = cell.querySelector('.player-name');
        
        if (!inputElement || !nameElement) return;

        // Get the value, treating empty or invalid input as 0
        const inputValue = inputElement.value;
        const pointsValue = parseInt(inputValue) || 0; 
        
        // Find the matching player object in the array by name
        const playerName = nameElement.textContent.trim();
        const playerToUpdate = players.find(p => p.name === playerName);

        if (playerToUpdate) {
            // Update the player object's score
            playerToUpdate.addPoints(pointsValue);
        }

        // Reset the input field
        inputElement.value = '';
    });
    
    // 2. Update the DOM: Sort the players and re-render the list
    updatePlacementsAndOrder(playerList);
}

// ===================================
// 5. DOM Management: Sort and Redraw
// ===================================
function updatePlacementsAndOrder(playerList) {
    console.log('--- Sorting players and re-rendering DOM ---');

    // 1. Sort the players array
    // Ascending order: Lowest score first = 1st place (a.points - b.points)
    players.sort((a, b) => a.points - b.points);

    // 2. Clear the entire existing DOM list
    playerList.innerHTML = ''; 

    // 3. Redraw all cells in the new sorted order
    players.forEach((player, index) => {
        // The new placement is based on the index + 1 after sorting
        const newPlacement = index + 1;
        
        // Redraw the cell using the sorted player object and its new placement index
        redrawPlayerCell(player, newPlacement, playerList);
    });
    
    console.log('Players array after sort:', players);
}

// ===================================
// 6. DOM Helper: Creates/Redraws a Player Element
// ===================================
function redrawPlayerCell(player, placementIndex, container) {
    // We increment a general counter for unique IDs, separate from placement
    cellIndexCounter++; 
    
    // Function to get the correct placement suffix (1st, 2nd, 3rd...)
    const getPlacementSuffix = (i) => {
        const j = i % 10, k = i % 100;
        if (j === 1 && k !== 11) return "st";
        if (j === 2 && k !== 12) return "nd";
        if (j === 3 && k !== 13) return "rd";
        return "th";
    };

    // 1. Create the main cell container
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-cell-index', cellIndexCounter); 

    // 2. Create the placement element
    const placement = document.createElement('div');
    placement.classList.add('placement');
    placement.textContent = placementIndex + getPlacementSuffix(placementIndex);
    
    // 3. Create the player name element
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('player-name');
    nameDiv.textContent = player.name; 
    
    // 4. Create the input element (for new points)
    const input = document.createElement('input');
    input.classList.add('input-points');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `inputPoints-${cellIndexCounter}`); 
    input.setAttribute('name', 'inputPoints');
    input.setAttribute('placeholder', 'Enter points');
    input.setAttribute('oninput', "this.value = this.value.replace(/[^0-9]/g, '')");

    // 5. Create the total points element
    const totalPoints = document.createElement('div');
    totalPoints.classList.add('total-points');
    totalPoints.textContent = `Total: ${player.points}`; 

    // 6. Assemble and append
    cell.appendChild(placement);
    cell.appendChild(nameDiv);
    cell.appendChild(input);
    cell.appendChild(totalPoints);
    container.appendChild(cell);
}