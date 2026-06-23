/**
 * Zero Leftover — interactive meal planning logic
 *
 * Flow:
 *  1. User clicks meal cards → toggles selection (highlighted state)
 *  2. Selected meals → combined grocery list (ingredients merged by name)
 *  3. Ingredients with partial usage → detected leftovers → matched bonus recipe
 */

const UNSPLASH = 'https://images.unsplash.com';

// ─── Ingredient photo lookup (Unsplash) ───────────────────────────────────────

const INGREDIENT_IMAGES = {
  spaghetti: `${UNSPLASH}/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=200&q=80`,
  'ground beef': `${UNSPLASH}/photo-1603048297172-c9254474d9c2?auto=format&fit=crop&w=200&q=80`,
  onion: `${UNSPLASH}/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80`,
  garlic: `${UNSPLASH}/photo-1601493701235-5850a882b24e?auto=format&fit=crop&w=200&q=80`,
  'tomato sauce': `${UNSPLASH}/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=200&q=80`,
  parmesan: `${UNSPLASH}/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80`,
  'chicken breast': `${UNSPLASH}/photo-1604503468506-440c6ded15f9?auto=format&fit=crop&w=200&q=80`,
  spinach: `${UNSPLASH}/photo-1576040916760-2b55cfe63577?auto=format&fit=crop&w=200&q=80`,
  cucumber: `${UNSPLASH}/photo-1449305177337-042093f179e3?auto=format&fit=crop&w=200&q=80`,
  'cherry tomatoes': `${UNSPLASH}/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=200&q=80`,
  'olive oil': `${UNSPLASH}/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80`,
  lemon: `${UNSPLASH}/photo-1590502593747-93fa29117513?auto=format&fit=crop&w=200&q=80`,
  'taco shells': `${UNSPLASH}/photo-1565299585323-38174c4aabaa?auto=format&fit=crop&w=200&q=80`,
  'black beans': `${UNSPLASH}/photo-1516684669134-48d8d64f3998?auto=format&fit=crop&w=200&q=80`,
  'bell peppers': `${UNSPLASH}/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=200&q=80`,
  cilantro: `${UNSPLASH}/photo-1618375569909-fcbac6d0c114?auto=format&fit=crop&w=200&q=80`,
  lime: `${UNSPLASH}/photo-1515589666096-783ea1e4cdf7?auto=format&fit=crop&w=200&q=80`,
  avocado: `${UNSPLASH}/photo-1523049673857-eb18fc1d7b2a?auto=format&fit=crop&w=200&q=80`,
  'jasmine rice': `${UNSPLASH}/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80`,
  chickpeas: `${UNSPLASH}/photo-1516684669134-48d8d64f3998?auto=format&fit=crop&w=200&q=80`,
  'feta cheese': `${UNSPLASH}/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80`,
};

const DEFAULT_INGREDIENT_IMAGE = `${UNSPLASH}/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=200&q=80`;

// Default placeholder for user-created meals (generic plated food)
const CUSTOM_MEAL_PLACEHOLDER = `${UNSPLASH}/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80`;

// ─── Sample meals (behind the scenes data) ────────────────────────────────────
//
// Each ingredient has:
//   name, amount (display), usedFraction (0–1 of what you buy),
//   leftoverLabel (what's left, shown when usedFraction < 1)

const MEALS = [
  {
    id: 'spaghetti',
    name: 'Spaghetti Marinara',
    image: `${UNSPLASH}/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Spaghetti', amount: '1 lb', usedFraction: 1 },
      { name: 'Ground beef', amount: '1 lb', usedFraction: 1 },
      { name: 'Onion', amount: '1 large', usedFraction: 0.5, leftoverLabel: '1/2 large onion' },
      { name: 'Garlic', amount: '4 cloves', usedFraction: 0.5, leftoverLabel: '2 cloves garlic' },
      { name: 'Tomato sauce', amount: '1 can (24 oz)', usedFraction: 1 },
      { name: 'Parmesan', amount: '1/2 cup', usedFraction: 0.5, leftoverLabel: '1/4 cup parmesan' },
    ],
  },
  {
    id: 'chicken-salad',
    name: 'Chicken Salad',
    image: `${UNSPLASH}/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`,
    servings: 3,
    ingredients: [
      { name: 'Chicken breast', amount: '1.5 lbs', usedFraction: 1 },
      { name: 'Spinach', amount: '1 bag (10 oz)', usedFraction: 0.5, leftoverLabel: '1/2 bag spinach' },
      { name: 'Cucumber', amount: '1 medium', usedFraction: 0.5, leftoverLabel: '1/2 cucumber' },
      { name: 'Cherry tomatoes', amount: '1 cup', usedFraction: 0.5, leftoverLabel: '1/2 cup cherry tomatoes' },
      { name: 'Olive oil', amount: '3 tbsp', usedFraction: 1 },
      { name: 'Lemon', amount: '1', usedFraction: 0.5, leftoverLabel: '1/2 lemon' },
    ],
  },
  {
    id: 'veggie-tacos',
    name: 'Veggie Tacos',
    image: `${UNSPLASH}/photo-1565299585323-38174c4aabaa?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Taco shells', amount: '12 shells', usedFraction: 0.67, leftoverLabel: '4 taco shells' },
      { name: 'Black beans', amount: '1 can (15 oz)', usedFraction: 1 },
      { name: 'Bell peppers', amount: '2 large', usedFraction: 0.5, leftoverLabel: '1 large bell pepper' },
      { name: 'Onion', amount: '1 large', usedFraction: 0.5, leftoverLabel: '1/2 large onion' },
      { name: 'Cilantro', amount: '1 bunch', usedFraction: 0.5, leftoverLabel: '1/2 bunch cilantro' },
      { name: 'Lime', amount: '2', usedFraction: 0.5, leftoverLabel: '1 lime' },
      { name: 'Avocado', amount: '2', usedFraction: 0.5, leftoverLabel: '1 avocado' },
    ],
  },
  {
    id: 'mediterranean-bowl',
    name: 'Mediterranean Rice Bowl',
    image: `${UNSPLASH}/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80`,
    servings: 3,
    ingredients: [
      { name: 'Jasmine rice', amount: '2 cups dry', usedFraction: 0.5, leftoverLabel: '1 cup dry jasmine rice' },
      { name: 'Chickpeas', amount: '1 can (15 oz)', usedFraction: 0.5, leftoverLabel: '1/2 can chickpeas' },
      { name: 'Spinach', amount: '2 cups', usedFraction: 0.5, leftoverLabel: '1 cup spinach' },
      { name: 'Feta cheese', amount: '1/2 cup', usedFraction: 0.5, leftoverLabel: '1/4 cup feta cheese' },
      { name: 'Cucumber', amount: '1 medium', usedFraction: 0.5, leftoverLabel: '1/2 cucumber' },
      { name: 'Cherry tomatoes', amount: '1 cup', usedFraction: 0.5, leftoverLabel: '1/2 cup cherry tomatoes' },
    ],
  },
];

// Bonus recipes matched to common leftover ingredients
const BONUS_RECIPES = [
  {
    id: 'spinach-feta-omelette',
    title: 'Spinach & Feta Omelette',
    image: `${UNSPLASH}/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80`,
    description: 'Fold leftover spinach and feta into a fluffy omelette — perfect for half a bag of greens still in the fridge.',
    tags: ['15 min', 'Breakfast'],
    matches: ['spinach', 'feta cheese', 'onion', 'bell peppers'],
    extraIngredients: ['2 eggs', '1 tbsp butter', 'Salt & pepper'],
  },
  {
    id: 'veggie-quesadillas',
    title: 'Veggie Quesadillas',
    image: `${UNSPLASH}/photo-1618040996339-56904b7850b7?auto=format&fit=crop&w=900&q=80`,
    description: 'Crisp up leftover taco shells or tortillas with beans, peppers, and cheese for a quick second dinner.',
    tags: ['20 min', 'Dinner'],
    matches: ['taco shells', 'black beans', 'bell peppers', 'onion', 'cilantro', 'avocado'],
    extraIngredients: ['Shredded cheese', 'Sour cream (optional)'],
  },
  {
    id: 'garden-chickpea-salad',
    title: 'Garden Chickpea Salad',
    image: `${UNSPLASH}/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80`,
    description: 'Toss leftover chickpeas, cucumber, and tomatoes with lemon for a bright lunch that clears the produce drawer.',
    tags: ['10 min', 'Lunch'],
    matches: ['chickpeas', 'cucumber', 'cherry tomatoes', 'lemon', 'cilantro', 'spinach'],
    extraIngredients: ['2 tbsp olive oil', 'Salt & pepper'],
  },
  {
    id: 'garlic-parmesan-pasta',
    title: 'Garlic Parmesan Pasta',
    image: `${UNSPLASH}/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80`,
    description: 'Use extra spaghetti and parmesan with garlic for a simple side that finishes what spaghetti night left behind.',
    tags: ['15 min', 'Side dish'],
    matches: ['spaghetti', 'parmesan', 'garlic', 'cherry tomatoes'],
    extraIngredients: ['2 tbsp olive oil', 'Red pepper flakes'],
  },
];

// ─── App state ────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  customMeals: 'zeroLeftover_customMeals',
  selectedMeals: 'zeroLeftover_selectedMeals',
  checkedGroceries: 'zeroLeftover_checkedGroceries',
};

const state = {
  selectedMealIds: new Set(),
  checkedGroceries: new Set(),
  customMeals: [],
};

// ─── localStorage persistence ─────────────────────────────────────────────────

function saveCustomMeals() {
  try {
    localStorage.setItem(STORAGE_KEYS.customMeals, JSON.stringify(state.customMeals));
  } catch (error) {
    console.warn('Could not save custom meals to localStorage:', error);
  }
}

function saveSelectedMeals() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.selectedMeals,
      JSON.stringify(Array.from(state.selectedMealIds))
    );
  } catch (error) {
    console.warn('Could not save selected meals to localStorage:', error);
  }
}

function saveCheckedGroceries() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.checkedGroceries,
      JSON.stringify(Array.from(state.checkedGroceries))
    );
  } catch (error) {
    console.warn('Could not save grocery checkoffs to localStorage:', error);
  }
}

function isValidCustomMeal(meal) {
  if (!meal || typeof meal !== 'object') return false;
  if (!meal.id || !meal.name || !Array.isArray(meal.ingredients)) return false;
  if (meal.ingredients.length === 0) return false;

  return meal.ingredients.every(
    (ingredient) =>
      ingredient &&
      typeof ingredient.name === 'string' &&
      typeof ingredient.amount === 'string' &&
      typeof ingredient.usedFraction === 'number'
  );
}

function normalizeStoredCustomMeal(meal) {
  return {
    id: meal.id,
    name: meal.name,
    image: meal.image || CUSTOM_MEAL_PLACEHOLDER,
    servings: meal.servings || Math.max(2, Math.ceil(meal.ingredients.length / 3)),
    isCustom: true,
    ingredients: meal.ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount,
      usedFraction: ingredient.usedFraction,
      leftoverLabel: ingredient.leftoverLabel,
    })),
  };
}

/**
 * On page load: restore custom meals and selected meal IDs from localStorage,
 * then rebuild the UI (meal cards, grocery list, leftover magic).
 */
function loadFromStorage() {
  try {
    const savedCustomMeals = localStorage.getItem(STORAGE_KEYS.customMeals);
    if (savedCustomMeals) {
      const parsed = JSON.parse(savedCustomMeals);
      if (Array.isArray(parsed)) {
        state.customMeals = parsed
          .filter(isValidCustomMeal)
          .map(normalizeStoredCustomMeal);
      }
    }
  } catch (error) {
    console.warn('Could not load custom meals from localStorage:', error);
    state.customMeals = [];
  }

  try {
    const savedSelection = localStorage.getItem(STORAGE_KEYS.selectedMeals);
    if (savedSelection) {
      const parsed = JSON.parse(savedSelection);
      if (Array.isArray(parsed)) {
        const validMealIds = new Set(getAllMeals().map((meal) => meal.id));
        state.selectedMealIds = new Set(
          parsed.filter((id) => typeof id === 'string' && validMealIds.has(id))
        );
      }
    }
  } catch (error) {
    console.warn('Could not load selected meals from localStorage:', error);
    state.selectedMealIds.clear();
  }

  try {
    const savedChecked = localStorage.getItem(STORAGE_KEYS.checkedGroceries);
    if (savedChecked) {
      const parsed = JSON.parse(savedChecked);
      if (Array.isArray(parsed)) {
        state.checkedGroceries = new Set(
          parsed.filter((id) => typeof id === 'string')
        );
      }
    }
  } catch (error) {
    console.warn('Could not load grocery checkoffs from localStorage:', error);
    state.checkedGroceries.clear();
  }
}

// ─── DOM references ───────────────────────────────────────────────────────────

const mealGrid = document.getElementById('meal-grid');
const selectionSummary = document.getElementById('selection-summary');
const selectionCount = document.getElementById('selection-count');
const clearSelectionBtn = document.getElementById('clear-selection');
const groceryEmpty = document.getElementById('grocery-empty');
const groceryPanel = document.getElementById('grocery-panel');
const groceryChecklist = document.getElementById('grocery-checklist');
const groceryItemCount = document.getElementById('grocery-item-count');
const groceryProgress = document.getElementById('grocery-progress');
const uncheckAllBtn = document.getElementById('uncheck-all');
const startFreshBtn = document.getElementById('start-fresh-btn');
const leftoverEmpty = document.getElementById('leftover-empty');
const leftoverPanel = document.getElementById('leftover-panel');
const leftoverList = document.getElementById('leftover-list');
const leftoverCount = document.getElementById('leftover-count');
const recipeSpotlight = document.getElementById('recipe-spotlight');
const addMealForm = document.getElementById('add-meal-form');
const mealNameInput = document.getElementById('meal-name-input');
const mealIngredientsInput = document.getElementById('meal-ingredients-input');
const addMealError = document.getElementById('add-meal-error');
const addMealSuccess = document.getElementById('add-meal-success');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalizeWords(str) {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getAllMeals() {
  return [...MEALS, ...state.customMeals];
}

function getIngredientImage(name) {
  return INGREDIENT_IMAGES[name.toLowerCase()] || DEFAULT_INGREDIENT_IMAGE;
}

function normalizeKey(name) {
  return name.toLowerCase().trim();
}

function getSelectedMeals() {
  return getAllMeals().filter((meal) => state.selectedMealIds.has(meal.id));
}

// ─── Custom meals ─────────────────────────────────────────────────────────────

/**
 * Parse "2 cups spinach" → { amount: "2 cups", name: "Spinach" }
 * Plain "onion" → { amount: "1", name: "Onion" }
 */
function parseIngredientInput(raw) {
  const text = raw.trim();
  if (!text) return null;

  const quantityPattern = /^([\d./]+\s*(?:lbs?|pounds?|oz|ounces?|cups?|tbsp|tsp|teaspoons?|tablespoons?|cloves?|cans?|bunch(?:es)?|large|medium|small|bags?|shells?|slices?)?\s+)(.+)$/i;
  const match = text.match(quantityPattern);

  if (match) {
    return {
      amount: match[1].trim(),
      name: capitalizeWords(match[2].trim()),
    };
  }

  return {
    amount: '1',
    name: capitalizeWords(text),
  };
}

function buildCustomIngredient(raw) {
  const parsed = parseIngredientInput(raw);
  if (!parsed) return null;

  const { name, amount } = parsed;
  const leftoverLabel = amount === '1'
    ? `half ${name.toLowerCase()}`
    : `half ${amount} ${name.toLowerCase()}`;

  return {
    name,
    amount,
    usedFraction: 0.5,
    leftoverLabel,
  };
}

function createCustomMeal(name, ingredientsText) {
  const ingredientParts = ingredientsText
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const ingredients = ingredientParts
    .map(buildCustomIngredient)
    .filter(Boolean);

  if (ingredients.length === 0) return null;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);

  return {
    id: `custom-${slug || 'meal'}-${Date.now()}`,
    name: name.trim(),
    image: CUSTOM_MEAL_PLACEHOLDER,
    servings: Math.max(2, Math.ceil(ingredients.length / 3)),
    isCustom: true,
    ingredients,
  };
}

function showFormFeedback(element, message) {
  addMealError.hidden = true;
  addMealSuccess.hidden = true;

  if (!element) return;

  element.textContent = message;
  element.hidden = false;
}

function clearFormFeedback() {
  addMealError.hidden = true;
  addMealSuccess.hidden = true;
  addMealError.textContent = '';
  addMealSuccess.textContent = '';
}

function handleAddMeal(event) {
  event.preventDefault();
  clearFormFeedback();

  const name = mealNameInput.value.trim();
  const ingredientsText = mealIngredientsInput.value.trim();

  if (!name) {
    showFormFeedback(addMealError, 'Please enter a meal name.');
    mealNameInput.focus();
    return;
  }

  if (!ingredientsText) {
    showFormFeedback(addMealError, 'Please enter at least one ingredient (comma-separated).');
    mealIngredientsInput.focus();
    return;
  }

  const meal = createCustomMeal(name, ingredientsText);
  if (!meal) {
    showFormFeedback(addMealError, 'Could not parse ingredients. Try separating them with commas.');
    return;
  }

  state.customMeals.push(meal);
  saveCustomMeals();
  mealNameInput.value = '';
  mealIngredientsInput.value = '';

  showFormFeedback(addMealSuccess, `"${meal.name}" added! Click the card to select it.`);
  updateAllViews();

  const newCard = mealGrid.querySelector(`[data-meal-id="${meal.id}"]`);
  if (newCard) {
    newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  setTimeout(clearFormFeedback, 4000);
}

// ─── Init & navigation ────────────────────────────────────────────────────────

function init() {
  loadFromStorage();
  bindNavigation();
  bindMealActions();
  bindGroceryActions();
  bindAddMealForm();
  bindStartFresh();
  updateAllViews();
}

function bindStartFresh() {
  if (!startFreshBtn) return;
  startFreshBtn.addEventListener('click', startFreshWeek);
}

/**
 * Reset the week: clear meal selections, grocery checkoffs, and related localStorage.
 * Custom meals are kept so users don't lose their saved recipes.
 */
function startFreshWeek() {
  const hasSelections = state.selectedMealIds.size > 0;
  const hasCheckoffs = state.checkedGroceries.size > 0;

  if (!hasSelections && !hasCheckoffs) {
    showSection('meal-selector');
    return;
  }

  const confirmed = window.confirm(
    'Start a new week? This will clear your meal selections and grocery checkoffs so you can plan again.'
  );
  if (!confirmed) return;

  state.selectedMealIds.clear();
  state.checkedGroceries.clear();

  try {
    localStorage.removeItem(STORAGE_KEYS.selectedMeals);
    localStorage.removeItem(STORAGE_KEYS.checkedGroceries);
  } catch (error) {
    console.warn('Could not clear week data from localStorage:', error);
  }

  updateAllViews();
  showSection('meal-selector');
}

function bindAddMealForm() {
  if (!addMealForm) return;
  addMealForm.addEventListener('submit', handleAddMeal);
}

function bindNavigation() {
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const sectionId = el.getAttribute('data-nav');
      if (sectionId) showSection(sectionId);
    });
  });
}

function showSection(sectionId) {
  document.querySelectorAll('.page-section').forEach((section) => {
    const isActive = section.id === sectionId;
    section.classList.toggle('active', isActive);
    section.hidden = !isActive;
  });

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === sectionId);
  });
}

function bindMealActions() {
  clearSelectionBtn.addEventListener('click', () => {
    state.selectedMealIds.clear();
    state.checkedGroceries.clear();
    saveSelectedMeals();
    saveCheckedGroceries();
    updateAllViews();
  });
}

function bindGroceryActions() {
  uncheckAllBtn.addEventListener('click', () => {
    state.checkedGroceries.clear();
    saveCheckedGroceries();
    renderGroceryList();
  });
}

// ─── Meal selector: click to select / deselect ────────────────────────────────

function renderMealGrid() {
  mealGrid.innerHTML = getAllMeals().map((meal) => {
    const selected = state.selectedMealIds.has(meal.id);
    const customClass = meal.isCustom ? ' meal-card--custom' : '';
    const customBadge = meal.isCustom
      ? '<span class="meal-badge">Your meal</span>'
      : '';

    return `
      <button
        type="button"
        class="meal-card${selected ? ' selected' : ''}${customClass}"
        data-meal-id="${meal.id}"
        role="listitem"
        aria-pressed="${selected}"
        aria-label="${escapeHtml(meal.name)}${selected ? ' (selected)' : ''}"
      >
        ${customBadge}
        <span class="meal-check" aria-hidden="true">✓</span>
        <div class="meal-photo">
          <img src="${meal.image}" alt="${escapeHtml(meal.name)}" width="800" height="600" loading="lazy">
          <span class="meal-photo-overlay" aria-hidden="true"></span>
        </div>
        <div class="meal-info">
          <h3 class="meal-name">${escapeHtml(meal.name)}</h3>
          <p class="meal-meta">${meal.ingredients.length} ingredients · ${meal.servings} servings</p>
        </div>
      </button>
    `;
  }).join('');

  mealGrid.querySelectorAll('.meal-card').forEach((card) => {
    card.addEventListener('click', () => toggleMeal(card.dataset.mealId));
  });
}

function toggleMeal(mealId) {
  if (state.selectedMealIds.has(mealId)) {
    state.selectedMealIds.delete(mealId);
  } else {
    state.selectedMealIds.add(mealId);
  }
  saveSelectedMeals();
  updateAllViews();
}

function updateSelectionSummary() {
  const count = state.selectedMealIds.size;
  selectionSummary.hidden = count === 0;
  selectionCount.textContent = `${count} meal${count === 1 ? '' : 's'} selected`;
}

// ─── Grocery list: merge ingredients from selected meals ──────────────────────

function buildGroceryItems() {
  const ingredientMap = new Map();

  getSelectedMeals().forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const key = normalizeKey(ingredient.name);

      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          name: ingredient.name,
          amounts: [],
          sources: [],
        });
      }

      const entry = ingredientMap.get(key);
      entry.amounts.push(ingredient.amount);
      if (!entry.sources.includes(meal.name)) {
        entry.sources.push(meal.name);
      }
    });
  });

  return Array.from(ingredientMap.values()).map((entry) => ({
    id: entry.name.toLowerCase().replace(/\s+/g, '-'),
    name: entry.name,
    amount: entry.amounts.join(' + '),
    sources: entry.sources,
    image: getIngredientImage(entry.name),
  }));
}

function renderGroceryList() {
  const items = buildGroceryItems();
  const hasMeals = items.length > 0;

  groceryEmpty.hidden = hasMeals;
  groceryPanel.hidden = !hasMeals;

  if (!hasMeals) return;

  const checkedCount = items.filter((item) => state.checkedGroceries.has(item.id)).length;

  groceryItemCount.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;

  if (groceryProgress) {
    if (checkedCount > 0) {
      groceryProgress.textContent = `${checkedCount} of ${items.length} in cart`;
      groceryProgress.hidden = false;
    } else {
      groceryProgress.hidden = true;
      groceryProgress.textContent = '';
    }
  }

  groceryChecklist.innerHTML = items
    .map((item) => {
      const checked = state.checkedGroceries.has(item.id);
      return `
        <li class="checklist-item${checked ? ' checked' : ''}">
          <input
            type="checkbox"
            class="grocery-checkbox"
            id="grocery-${item.id}"
            data-grocery-id="${item.id}"
            aria-label="Mark ${escapeHtml(item.name)} as in cart"
            ${checked ? 'checked' : ''}
          >
          <img class="ingredient-thumb" src="${item.image}" alt="" width="52" height="52" loading="lazy">
          <div class="checklist-content">
            <label for="grocery-${item.id}">
              ${escapeHtml(item.name)} <span class="amount">(${escapeHtml(item.amount)})</span>
            </label>
          </div>
          <span class="checklist-source">${escapeHtml(item.sources.join(', '))}</span>
        </li>
      `;
    })
    .join('');

  groceryChecklist.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const id = checkbox.dataset.groceryId;
      if (checkbox.checked) {
        state.checkedGroceries.add(id);
      } else {
        state.checkedGroceries.delete(id);
      }
      saveCheckedGroceries();
      checkbox.closest('.checklist-item').classList.toggle('checked', checkbox.checked);
      updateGroceryProgress(items);
    });
  });
}

function updateGroceryProgress(items) {
  if (!groceryProgress || !items) return;

  const checkedCount = items.filter((item) => state.checkedGroceries.has(item.id)).length;

  if (checkedCount > 0) {
    groceryProgress.textContent = `${checkedCount} of ${items.length} in cart`;
    groceryProgress.hidden = false;
  } else {
    groceryProgress.hidden = true;
    groceryProgress.textContent = '';
  }
}

// ─── Leftover Magic: detect partial ingredients & suggest bonus recipe ────────

/**
 * Scans every ingredient in selected meals.
 * If usedFraction < 1, the recipe only uses part of what you bought → leftover.
 * Same ingredient across meals is merged (e.g. onion from spaghetti + tacos).
 */
function detectLeftovers() {
  const leftoverMap = new Map();

  getSelectedMeals().forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      if (ingredient.usedFraction >= 1) return;

      const key = normalizeKey(ingredient.name);
      const label = ingredient.leftoverLabel || `some ${ingredient.name.toLowerCase()}`;
      const unusedFraction = 1 - ingredient.usedFraction;

      if (!leftoverMap.has(key)) {
        leftoverMap.set(key, {
          name: ingredient.name,
          labels: [],
          unusedFraction: 0,
          meals: [],
        });
      }

      const entry = leftoverMap.get(key);
      entry.labels.push(label);
      entry.unusedFraction += unusedFraction;
      if (!entry.meals.includes(meal.name)) {
        entry.meals.push(meal.name);
      }
    });
  });

  return Array.from(leftoverMap.values())
    .map((entry) => ({
      name: entry.name,
      remaining: entry.labels.length > 1 ? entry.labels.join(' + ') : entry.labels[0],
      unusedFraction: entry.unusedFraction,
      meals: entry.meals,
      image: getIngredientImage(entry.name),
    }))
    .sort((a, b) => b.unusedFraction - a.unusedFraction);
}

/**
 * Score each bonus recipe by how many detected leftovers it can use.
 * Pick the highest-scoring match.
 */
function findBestBonusRecipe(leftovers) {
  if (leftovers.length === 0) return null;

  const leftoverKeys = leftovers.map((l) => normalizeKey(l.name));

  let bestRecipe = null;
  let bestScore = -1;

  BONUS_RECIPES.forEach((recipe) => {
    const score = recipe.matches.filter((match) =>
      leftoverKeys.some(
        (key) => key.includes(match) || match.includes(key)
      )
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  });

  return bestRecipe;
}

function getMatchedLeftovers(recipe, leftovers) {
  if (!recipe) return [];

  return leftovers.filter((item) =>
    recipe.matches.some(
      (match) =>
        normalizeKey(item.name).includes(match) || match.includes(normalizeKey(item.name))
    )
  );
}

function renderLeftoverMagic() {
  const hasMeals = state.selectedMealIds.size > 0;
  leftoverEmpty.hidden = hasMeals;
  leftoverPanel.hidden = !hasMeals;

  if (!hasMeals) return;

  const leftovers = detectLeftovers();
  const recipe = findBestBonusRecipe(leftovers);
  const matchedLeftovers = getMatchedLeftovers(recipe, leftovers);

  if (leftoverCount) {
    leftoverCount.textContent = `${leftovers.length} leftover${leftovers.length === 1 ? '' : 's'} detected`;
  }

  leftoverList.innerHTML = leftovers.length === 0
    ? '<li class="leftover-empty-msg">No partial ingredients detected — your meals use everything you buy!</li>'
    : leftovers
        .map(
          (item) => `
            <li>
              <img class="leftover-thumb" src="${item.image}" alt="${item.name}" width="48" height="48" loading="lazy">
              <div class="leftover-details">
                <span class="leftover-amount">${item.remaining}</span>
                <span class="leftover-name">${item.name}</span>
                <span class="leftover-from">from ${item.meals.join(', ')}</span>
              </div>
            </li>
          `
        )
        .join('');

  if (!recipe) {
    recipeSpotlight.innerHTML = '<p class="recipe-fallback">Select meals with partial ingredients to unlock a bonus recipe.</p>';
    return;
  }

  recipeSpotlight.innerHTML = `
    <div class="recipe-photo">
      <img src="${recipe.image}" alt="${recipe.title}" width="900" height="560" loading="lazy">
      <span class="recipe-photo-badge">Bonus recipe</span>
    </div>
    <div class="recipe-body">
      <h3 class="recipe-title">${recipe.title}</h3>
      <p class="recipe-desc">${recipe.description}</p>
      <div class="recipe-tags">
        ${recipe.tags.map((tag) => `<span class="recipe-tag">${tag}</span>`).join('')}
      </div>
      <p class="recipe-ingredients-title">Uses your leftovers</p>
      <ul class="recipe-ingredients">
        ${matchedLeftovers.map((item) => `<li>${item.remaining}</li>`).join('')}
      </ul>
      <p class="recipe-ingredients-title">You'll also need</p>
      <ul class="recipe-ingredients">
        ${recipe.extraIngredients.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
}

// ─── Sync all views when selection changes ────────────────────────────────────

function updateAllViews() {
  renderMealGrid();
  updateSelectionSummary();
  renderGroceryList();
  renderLeftoverMagic();
}

document.addEventListener('DOMContentLoaded', init);
