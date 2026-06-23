/**
 * Zero Leftover — starting framework
 * Meal selection, grocery list generation, and leftover suggestions.
 */

const MEALS = [
  {
    id: 'pasta-primavera',
    name: 'Pasta Primavera',
    icon: '🍝',
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
    icon: '🍗',
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
    icon: '🥗',
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
    icon: '🌮',
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
    icon: '🍛',
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
    icon: '🐟',
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
    icon: '🍳',
    description:
      'A quick skillet omelette that folds in leftover greens, herbs, and cheese for a zero-waste breakfast or lunch.',
    tags: ['15 min', 'Breakfast', 'Uses leftovers'],
    usesLeftovers: ['spinach', 'feta cheese', 'cilantro', 'dill'],
    extraIngredients: ['2 eggs', '1 tbsp butter', 'Salt & pepper'],
  },
  {
    id: 'veggie-frittata',
    title: 'Rainbow Veggie Frittata',
    icon: '🥘',
    description:
      'Bake whatever vegetables you have left into a golden frittata — perfect for peppers, broccoli, and tomatoes.',
    tags: ['30 min', 'One pan', 'Family size'],
    usesLeftovers: ['bell peppers', 'broccoli', 'cherry tomatoes', 'onion', 'zucchini'],
    extraIngredients: ['6 eggs', '1/4 cup milk', 'Olive oil'],
  },
  {
    id: 'spinach-pesto-pasta',
    title: 'Spinach Pesto Pasta',
    icon: '🌿',
    description:
      'Blend leftover spinach and herbs into a bright pesto, then toss with pasta for a second dinner from the same groceries.',
    tags: ['20 min', 'Dinner', 'Sauce hack'],
    usesLeftovers: ['spinach', 'cilantro', 'parmesan', 'garlic'],
    extraIngredients: ['8 oz pasta', '1/4 cup olive oil', 'Lemon juice'],
  },
  {
    id: 'coconut-veggie-soup',
    title: 'Coconut Veggie Soup',
    icon: '🥣',
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
          <span class="meal-photo-icon" aria-hidden="true">${meal.icon}</span>
          <span class="meal-photo-label">Photo</span>
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
          <label for="grocery-${item.id}">${item.name} <span class="amount">(${item.amount})</span></label>
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
    .map(
      (item) => `
        <li>
          <span class="leftover-amount">${item.remaining}</span>
          <span class="leftover-name">${item.name}</span>
        </li>
      `
    )
    .join('');

  const matchedLeftovers = leftovers.filter((item) =>
    recipe.usesLeftovers.some(
      (name) =>
        item.name.toLowerCase().includes(name) || name.includes(item.name.toLowerCase())
    )
  );

  recipeSpotlight.innerHTML = `
    <div class="recipe-photo" aria-hidden="true">${recipe.icon}</div>
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
