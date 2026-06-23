/**
 * Zero Leftover — meal selection, grocery list, and leftover suggestions.
 */

const UNSPLASH = 'https://images.unsplash.com';

const INGREDIENT_IMAGES = {
  pasta: `${UNSPLASH}/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=200&q=80`,
  'cherry tomatoes': `${UNSPLASH}/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=200&q=80`,
  zucchini: `${UNSPLASH}/photo-1592840600398-77cbf1603573?auto=format&fit=crop&w=200&q=80`,
  'olive oil': `${UNSPLASH}/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80`,
  garlic: `${UNSPLASH}/photo-1601493701235-5850a882b24e?auto=format&fit=crop&w=200&q=80`,
  parmesan: `${UNSPLASH}/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80`,
  'chicken breast': `${UNSPLASH}/photo-1604503468506-440c6ded15f9?auto=format&fit=crop&w=200&q=80`,
  'bell peppers': `${UNSPLASH}/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=200&q=80`,
  broccoli: `${UNSPLASH}/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=200&q=80`,
  'soy sauce': `${UNSPLASH}/photo-1582878826629-29ae7a3a1f12?auto=format&fit=crop&w=200&q=80`,
  ginger: `${UNSPLASH}/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80`,
  rice: `${UNSPLASH}/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80`,
  spinach: `${UNSPLASH}/photo-1576040916760-2b55cfe63577?auto=format&fit=crop&w=200&q=80`,
  cucumber: `${UNSPLASH}/photo-1449305177337-042093f179e3?auto=format&fit=crop&w=200&q=80`,
  'feta cheese': `${UNSPLASH}/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80`,
  lemon: `${UNSPLASH}/photo-1590502593747-93fa29117513?auto=format&fit=crop&w=200&q=80`,
  walnuts: `${UNSPLASH}/photo-1550254470-447d8868fbf6?auto=format&fit=crop&w=200&q=80`,
  'ground beef': `${UNSPLASH}/photo-1603048297172-c9254474d9c2?auto=format&fit=crop&w=200&q=80`,
  'taco shells': `${UNSPLASH}/photo-1565299585323-38174c4aabaa?auto=format&fit=crop&w=200&q=80`,
  onion: `${UNSPLASH}/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80`,
  cilantro: `${UNSPLASH}/photo-1618375569909-fcbac6d0c114?auto=format&fit=crop&w=200&q=80`,
  'sour cream': `${UNSPLASH}/photo-1628088062859-63c3cd9cd64a?auto=format&fit=crop&w=200&q=80`,
  lime: `${UNSPLASH}/photo-1515589666096-783ea1e4cdf7?auto=format&fit=crop&w=200&q=80`,
  'coconut milk': `${UNSPLASH}/photo-1584270354949-c26b0d42b0b1?auto=format&fit=crop&w=200&q=80`,
  'sweet potato': `${UNSPLASH}/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80`,
  chickpeas: `${UNSPLASH}/photo-1516684669134-48d8d64f3998?auto=format&fit=crop&w=200&q=80`,
  'curry paste': `${UNSPLASH}/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80`,
  'jasmine rice': `${UNSPLASH}/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80`,
  'salmon fillets': `${UNSPLASH}/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=200&q=80`,
  asparagus: `${UNSPLASH}/photo-1615485925615-df9e065a5c0c?auto=format&fit=crop&w=200&q=80`,
  dill: `${UNSPLASH}/photo-1618375569909-fcbac6d0c114?auto=format&fit=crop&w=200&q=80`,
};

const DEFAULT_INGREDIENT_IMAGE = `${UNSPLASH}/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=200&q=80`;

const MEALS = [
  {
    id: 'pasta-primavera',
    name: 'Pasta Primavera',
    image: `${UNSPLASH}/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Pasta', amount: '1 lb' },
      { name: 'Cherry tomatoes', amount: '2 cups' },
      { name: 'Zucchini', amount: '1 medium' },
      { name: 'Olive oil', amount: '3 tbsp' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Parmesan', amount: '1/2 cup' },
    ],
    leftoverProfile: [
      { name: 'Cherry tomatoes', remaining: '1 cup', fraction: 0.5 },
      { name: 'Zucchini', remaining: '1/2 medium', fraction: 0.5 },
      { name: 'Parmesan', remaining: '1/4 cup', fraction: 0.5 },
    ],
  },
  {
    id: 'chicken-stir-fry',
    name: 'Chicken Stir-Fry',
    image: `${UNSPLASH}/photo-1603133872877-684f208fb84b?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Chicken breast', amount: '1.5 lbs' },
      { name: 'Bell peppers', amount: '2 large' },
      { name: 'Broccoli', amount: '1 head' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Ginger', amount: '1 tbsp' },
      { name: 'Rice', amount: '2 cups' },
    ],
    leftoverProfile: [
      { name: 'Bell peppers', remaining: '1 large', fraction: 0.5 },
      { name: 'Broccoli', remaining: '1/2 head', fraction: 0.5 },
      { name: 'Rice', remaining: '1 cup', fraction: 0.5 },
    ],
  },
  {
    id: 'spinach-salad',
    name: 'Spinach Power Salad',
    image: `${UNSPLASH}/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80`,
    servings: 2,
    ingredients: [
      { name: 'Spinach', amount: '1 bag (10 oz)' },
      { name: 'Cucumber', amount: '1 medium' },
      { name: 'Feta cheese', amount: '1/2 cup' },
      { name: 'Lemon', amount: '1' },
      { name: 'Walnuts', amount: '1/4 cup' },
    ],
    leftoverProfile: [
      { name: 'Spinach', remaining: '1/2 bag', fraction: 0.5 },
      { name: 'Feta cheese', remaining: '1/4 cup', fraction: 0.5 },
      { name: 'Cucumber', remaining: '1/2 medium', fraction: 0.5 },
    ],
  },
  {
    id: 'taco-night',
    name: 'Taco Night',
    image: `${UNSPLASH}/photo-1565299585323-38174c4aabaa?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Ground beef', amount: '1 lb' },
      { name: 'Taco shells', amount: '12' },
      { name: 'Onion', amount: '1 large' },
      { name: 'Cilantro', amount: '1 bunch' },
      { name: 'Sour cream', amount: '1/2 cup' },
      { name: 'Lime', amount: '2' },
    ],
    leftoverProfile: [
      { name: 'Onion', remaining: '1/2 large', fraction: 0.5 },
      { name: 'Cilantro', remaining: '1/2 bunch', fraction: 0.5 },
      { name: 'Sour cream', remaining: '1/4 cup', fraction: 0.5 },
    ],
  },
  {
    id: 'veggie-curry',
    name: 'Veggie Curry',
    image: `${UNSPLASH}/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80`,
    servings: 4,
    ingredients: [
      { name: 'Coconut milk', amount: '1 can' },
      { name: 'Sweet potato', amount: '2 medium' },
      { name: 'Chickpeas', amount: '1 can' },
      { name: 'Spinach', amount: '2 cups' },
      { name: 'Curry paste', amount: '2 tbsp' },
      { name: 'Jasmine rice', amount: '2 cups' },
    ],
    leftoverProfile: [
      { name: 'Spinach', remaining: '1 cup', fraction: 0.5 },
      { name: 'Sweet potato', remaining: '1 medium', fraction: 0.5 },
      { name: 'Coconut milk', remaining: '1/2 can', fraction: 0.5 },
    ],
  },
  {
    id: 'salmon-sheet-pan',
    name: 'Sheet Pan Salmon',
    image: `${UNSPLASH}/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80`,
    servings: 2,
    ingredients: [
      { name: 'Salmon fillets', amount: '2' },
      { name: 'Asparagus', amount: '1 bunch' },
      { name: 'Cherry tomatoes', amount: '1 cup' },
      { name: 'Lemon', amount: '1' },
      { name: 'Dill', amount: '2 tbsp' },
    ],
    leftoverProfile: [
      { name: 'Asparagus', remaining: '1/2 bunch', fraction: 0.5 },
      { name: 'Cherry tomatoes', remaining: '1/2 cup', fraction: 0.5 },
      { name: 'Lemon', remaining: '1/2', fraction: 0.5 },
    ],
  },
];

const BONUS_RECIPES = [
  {
    id: 'green-goddess-omelette',
    title: 'Green Goddess Omelette',
    image: `${UNSPLASH}/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80`,
    description:
      'A quick skillet omelette that folds in leftover greens, herbs, and cheese for a zero-waste breakfast or lunch.',
    tags: ['15 min', 'Breakfast', 'Uses leftovers'],
    usesLeftovers: ['spinach', 'feta cheese', 'cilantro', 'dill'],
    extraIngredients: ['2 eggs', '1 tbsp butter', 'Salt & pepper'],
  },
  {
    id: 'veggie-frittata',
    title: 'Rainbow Veggie Frittata',
    image: `${UNSPLASH}/photo-1608039829572-7851f79148b0?auto=format&fit=crop&w=900&q=80`,
    description:
      'Bake whatever vegetables you have left into a golden frittata — perfect for peppers, broccoli, and tomatoes.',
    tags: ['30 min', 'One pan', 'Family size'],
    usesLeftovers: ['bell peppers', 'broccoli', 'cherry tomatoes', 'onion', 'zucchini'],
    extraIngredients: ['6 eggs', '1/4 cup milk', 'Olive oil'],
  },
  {
    id: 'spinach-pesto-pasta',
    title: 'Spinach Pesto Pasta',
    image: `${UNSPLASH}/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80`,
    description:
      'Blend leftover spinach and herbs into a bright pesto, then toss with pasta for a second dinner from the same groceries.',
    tags: ['20 min', 'Dinner', 'Sauce hack'],
    usesLeftovers: ['spinach', 'cilantro', 'parmesan', 'garlic'],
    extraIngredients: ['8 oz pasta', '1/4 cup olive oil', 'Lemon juice'],
  },
  {
    id: 'coconut-veggie-soup',
    title: 'Coconut Veggie Soup',
    image: `${UNSPLASH}/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80`,
    description:
      'Simmer leftover coconut milk with sweet potato and chickpeas for a cozy soup that clears the fridge.',
    tags: ['25 min', 'Soup', 'Comfort food'],
    usesLeftovers: ['coconut milk', 'sweet potato', 'chickpeas', 'spinach'],
    extraIngredients: ['1 cup water', 'Salt', 'Red pepper flakes'],
  },
];

const state = {
  selectedMealIds: new Set(),
  checkedGroceries: new Set(),
};

const mealGrid = document.getElementById('meal-grid');
const selectionSummary = document.getElementById('selection-summary');
const selectionCount = document.getElementById('selection-count');
const clearSelectionBtn = document.getElementById('clear-selection');
const groceryEmpty = document.getElementById('grocery-empty');
const groceryPanel = document.getElementById('grocery-panel');
const groceryChecklist = document.getElementById('grocery-checklist');
const groceryItemCount = document.getElementById('grocery-item-count');
const uncheckAllBtn = document.getElementById('uncheck-all');
const leftoverEmpty = document.getElementById('leftover-empty');
const leftoverPanel = document.getElementById('leftover-panel');
const leftoverList = document.getElementById('leftover-list');
const recipeSpotlight = document.getElementById('recipe-spotlight');

function getIngredientImage(name) {
  const key = name.toLowerCase();
  return INGREDIENT_IMAGES[key] || DEFAULT_INGREDIENT_IMAGE;
}

function init() {
  renderMealGrid();
  bindNavigation();
  bindMealActions();
  bindGroceryActions();
  updateAllViews();
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
    updateAllViews();
  });
}

function bindGroceryActions() {
  uncheckAllBtn.addEventListener('click', () => {
    state.checkedGroceries.clear();
    renderGroceryList();
  });
}

function renderMealGrid() {
  mealGrid.innerHTML = MEALS.map((meal) => {
    const selected = state.selectedMealIds.has(meal.id);
    return `
      <button
        type="button"
        class="meal-card${selected ? ' selected' : ''}"
        data-meal-id="${meal.id}"
        role="listitem"
        aria-pressed="${selected}"
        aria-label="${meal.name}${selected ? ' (selected)' : ''}"
      >
        <span class="meal-check" aria-hidden="true">✓</span>
        <div class="meal-photo">
          <img
            src="${meal.image}"
            alt="${meal.name}"
            width="800"
            height="600"
            loading="lazy"
          >
          <span class="meal-photo-overlay" aria-hidden="true"></span>
        </div>
        <div class="meal-info">
          <h3 class="meal-name">${meal.name}</h3>
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
  updateAllViews();
}

function getSelectedMeals() {
  return MEALS.filter((meal) => state.selectedMealIds.has(meal.id));
}

function buildGroceryItems() {
  const selectedMeals = getSelectedMeals();
  const ingredientMap = new Map();

  selectedMeals.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase();
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

  groceryItemCount.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;

  groceryChecklist.innerHTML = items
    .map((item) => {
      const checked = state.checkedGroceries.has(item.id);
      return `
        <li class="checklist-item${checked ? ' checked' : ''}">
          <input
            type="checkbox"
            id="grocery-${item.id}"
            data-grocery-id="${item.id}"
            ${checked ? 'checked' : ''}
          >
          <img
            class="ingredient-thumb"
            src="${item.image}"
            alt="${item.name}"
            width="52"
            height="52"
            loading="lazy"
          >
          <div class="checklist-content">
            <label for="grocery-${item.id}">
              ${item.name} <span class="amount">(${item.amount})</span>
            </label>
          </div>
          <span class="checklist-source">${item.sources.join(', ')}</span>
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
      checkbox.closest('.checklist-item').classList.toggle('checked', checkbox.checked);
    });
  });
}

function buildLeftovers() {
  const selectedMeals = getSelectedMeals();
  const leftoverMap = new Map();

  selectedMeals.forEach((meal) => {
    meal.leftoverProfile.forEach((item) => {
      const key = item.name.toLowerCase();
      if (!leftoverMap.has(key)) {
        leftoverMap.set(key, {
          name: item.name,
          remaining: item.remaining,
          fraction: item.fraction,
          meals: [],
        });
      }
      const entry = leftoverMap.get(key);
      entry.meals.push(meal.name);
      entry.fraction = Math.max(entry.fraction, item.fraction);
    });
  });

  return Array.from(leftoverMap.values()).sort((a, b) => b.fraction - a.fraction);
}

function findBestRecipe(leftovers) {
  if (leftovers.length === 0) return BONUS_RECIPES[0];

  const leftoverNames = leftovers.map((l) => l.name.toLowerCase());

  let bestRecipe = BONUS_RECIPES[0];
  let bestScore = -1;

  BONUS_RECIPES.forEach((recipe) => {
    const score = recipe.usesLeftovers.filter((name) =>
      leftoverNames.some((leftover) => leftover.includes(name) || name.includes(leftover))
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  });

  return bestRecipe;
}

function renderLeftoverMagic() {
  const hasMeals = state.selectedMealIds.size > 0;
  leftoverEmpty.hidden = hasMeals;
  leftoverPanel.hidden = !hasMeals;

  if (!hasMeals) return;

  const leftovers = buildLeftovers();
  const recipe = findBestRecipe(leftovers);

  leftoverList.innerHTML = leftovers
    .map((item) => {
      const image = getIngredientImage(item.name);
      return `
        <li>
          <img
            class="leftover-thumb"
            src="${image}"
            alt="${item.name}"
            width="48"
            height="48"
            loading="lazy"
          >
          <div class="leftover-details">
            <span class="leftover-amount">${item.remaining}</span>
            <span class="leftover-name">${item.name}</span>
          </div>
        </li>
      `;
    })
    .join('');

  const matchedLeftovers = leftovers.filter((item) =>
    recipe.usesLeftovers.some(
      (name) =>
        item.name.toLowerCase().includes(name) || name.includes(item.name.toLowerCase())
    )
  );

  recipeSpotlight.innerHTML = `
    <div class="recipe-photo">
      <img
        src="${recipe.image}"
        alt="${recipe.title}"
        width="900"
        height="560"
        loading="lazy"
      >
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
        ${matchedLeftovers.map((item) => `<li>${item.remaining} ${item.name}</li>`).join('')}
      </ul>
      <p class="recipe-ingredients-title">You'll also need</p>
      <ul class="recipe-ingredients">
        ${recipe.extraIngredients.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
}

function updateSelectionSummary() {
  const count = state.selectedMealIds.size;
  selectionSummary.hidden = count === 0;
  selectionCount.textContent = `${count} meal${count === 1 ? '' : 's'} selected`;
}

function updateAllViews() {
  renderMealGrid();
  updateSelectionSummary();
  renderGroceryList();
  renderLeftoverMagic();
}

document.addEventListener('DOMContentLoaded', init);
