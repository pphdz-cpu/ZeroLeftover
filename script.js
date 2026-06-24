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

const RECIPES_URL = 'recipes.json';

// Ingredients that are typically used entirely (not partial leftovers)
const FULL_USE_PATTERN = /^(salt|pepper|black pepper|oil|vinegar|sauce|paste|seasoning|spice|honey|soy sauce|mirin|gochujang|fish sauce|tamarind|broth|water)/i;

// Ingredients commonly bought in larger amounts than one recipe needs
const PARTIAL_USE_PATTERN = /onion|garlic|cheese|herb|lettuce|spinach|tomato|pepper|avocado|lime|lemon|cucumber|basil|cilantro|cream|yogurt|broccoli|mushroom|egg(?!plant)|rice|noodle|pasta|tortilla|mozzarella|feta| cabbage|carrot|zucchini|eggplant|bean sprout|peanut|pickle|coleslaw|dough|bun|shrimp|beef|chicken|pork|egg/i;

const CUSTOM_MEAL_LEFTOVER_TIP =
  'Use any extra ingredients in omelettes, wraps, or a quick stir-fry within a few days.';

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
  recipeMeals: [],
  recipesLoaded: false,
  recipesError: null,
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
    leftoversTips: meal.leftoversTips || CUSTOM_MEAL_LEFTOVER_TIP,
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
const detectedLeftoversPanel = document.getElementById('detected-leftovers-panel');
const pantrySaversList = document.getElementById('pantry-savers-list');
const pantrySaversCount = document.getElementById('pantry-savers-count');
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
  return [...state.recipeMeals, ...state.customMeals];
}

// ─── Load recipes from recipes.json ───────────────────────────────────────────

function isValidRecipe(recipe) {
  if (!recipe || typeof recipe !== 'object') return false;
  if (typeof recipe.id !== 'number' || !recipe.name || !Array.isArray(recipe.ingredients)) return false;
  if (recipe.ingredients.length === 0) return false;
  return recipe.ingredients.every((item) => typeof item === 'string' && item.trim());
}

function buildIngredientWithLeftover(name, amount) {
  const nameLower = name.toLowerCase();
  const isPartial =
    PARTIAL_USE_PATTERN.test(nameLower) && !FULL_USE_PATTERN.test(nameLower);

  if (!isPartial) {
    return { name, amount, usedFraction: 1 };
  }

  const leftoverLabel =
    amount === '1' || amount === 'to taste'
      ? `half ${nameLower}`
      : `half ${amount} ${nameLower}`;

  return { name, amount, usedFraction: 0.5, leftoverLabel };
}

function recipeToMeal(recipe) {
  const ingredients = recipe.ingredients
    .map((raw) => {
      const parsed = parseIngredientInput(raw);
      if (!parsed) return null;
      return buildIngredientWithLeftover(parsed.name, parsed.amount);
    })
    .filter(Boolean);

  return {
    id: `recipe-${recipe.id}`,
    name: recipe.name,
    image: recipe.image,
    type: recipe.type,
    country: recipe.country,
    leftoversTips: recipe.leftoversTips,
    servings: Math.max(2, Math.ceil(ingredients.length / 3)),
    isRecipe: true,
    ingredients,
  };
}

function applyRecipeData(recipes) {
  if (!Array.isArray(recipes)) {
    throw new Error('recipes data must be an array');
  }
  state.recipeMeals = recipes.filter(isValidRecipe).map(recipeToMeal);
  state.recipesError = null;
}

async function loadRecipes() {
  try {
    const response = await fetch(RECIPES_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const recipes = await response.json();
    applyRecipeData(recipes);
  } catch (error) {
    console.warn('Could not fetch recipes.json:', error);

    if (window.EMBEDDED_RECIPES && Array.isArray(window.EMBEDDED_RECIPES)) {
      applyRecipeData(window.EMBEDDED_RECIPES);
      console.info('Loaded recipes from embedded fallback.');
    } else {
      console.error('Failed to load recipes:', error);
      state.recipeMeals = [];
      state.recipesError = error.message;
    }
  } finally {
    state.recipesLoaded = true;
  }
}

function getMealMeta(meal) {
  if (meal.isCustom) {
    return `${meal.ingredients.length} ingredients · ${meal.servings} servings`;
  }
  if (meal.type && meal.country) {
    return `${meal.ingredients.length} ingredients · ${meal.servings} servings`;
  }
  return `${meal.ingredients.length} ingredients · ${meal.servings} servings`;
}

function getMealTags(meal) {
  if (!meal.type && !meal.country) return '';
  const tags = [];
  if (meal.type) tags.push(`<span class="meal-tag">${escapeHtml(meal.type)}</span>`);
  if (meal.country) tags.push(`<span class="meal-tag meal-tag--country">${escapeHtml(meal.country)}</span>`);
  return `<div class="meal-tags">${tags.join('')}</div>`;
}

function getIngredientImage(name) {
  return INGREDIENT_IMAGES[name.toLowerCase()] || DEFAULT_INGREDIENT_IMAGE;
}

function normalizeKey(name) {
  return name.toLowerCase().trim();
}

// ─── Grocery list: smart consolidation ────────────────────────────────────────

/** Map variant ingredient names to a single canonical key for grouping. */
const INGREDIENT_ALIASES = {
  onion: ['onions', 'red onion', 'yellow onion', 'large onion', 'white onion'],
  garlic: ['garlic cloves', 'cloves garlic', 'clove garlic', 'fresh garlic'],
  tomato: ['tomatoes', 'roma tomatoes', 'roma tomato', 'cherry tomatoes', 'cherry tomato'],
  'bell pepper': ['bell peppers', 'red bell pepper', 'yellow bell pepper', 'green bell pepper'],
  'chicken breast': ['chicken breasts', 'chicken thigh', 'chicken thighs'],
  parmesan: ['parmesan cheese', 'grated parmesan', 'pecorino romano', 'grated pecorino romano'],
  mozzarella: ['fresh mozzarella', 'mozzarella cheese'],
  'feta cheese': ['feta', 'crumbled feta'],
  cilantro: ['fresh cilantro', 'cilantro for garnish'],
  basil: ['fresh basil', 'fresh basil leaves', 'basil leaves'],
  spinach: ['baby spinach', 'fresh spinach'],
  rice: ['basmati rice', 'jasmine rice', 'cooked rice', 'white rice', 'arborio rice'],
  'olive oil': ['extra virgin olive oil'],
  'black pepper': ['pepper', 'ground pepper'],
  salt: ['kosher salt', 'sea salt', 'salt and pepper'],
  lime: ['limes', 'fresh lime'],
  lemon: ['lemons', 'fresh lemon'],
  egg: ['eggs', 'large eggs'],
  avocado: ['avocados'],
  cucumber: ['cucumbers', 'english cucumber'],
  carrot: ['carrots'],
  mushroom: ['mushrooms', 'cremini mushrooms', 'button mushrooms'],
  broccoli: ['broccoli florets', 'broccoli head'],
  chickpeas: ['chickpea', 'garbanzo beans'],
  'black beans': ['black bean'],
  'sour cream': ['crema'],
  cheese: ['shredded cheese'],
  tortilla: ['tortillas', 'flour tortillas', 'corn tortillas', 'small flour tortillas'],
  'taco shell': ['taco shells'],
  'ground beef': ['beef', 'minced beef'],
  shrimp: ['large shrimp', 'prawns'],
  'pork shoulder': ['pork', 'pulled pork'],
  'coconut milk': ['canned coconut milk'],
  'soy sauce': ['low sodium soy sauce'],
  ginger: ['fresh ginger', 'ginger root'],
  'bean sprout': ['bean sprouts'],
  'sweet potato': ['sweet potatoes'],
  asparagus: ['asparagus bunch'],
  dill: ['fresh dill'],
  walnut: ['walnuts'],
  peanut: ['peanuts'],
  pickle: ['pickle chips', 'pickles'],
  coleslaw: ['coleslaw mix'],
  dressing: ['caesar dressing'],
  crouton: ['croutons'],
  yogurt: ['plain yogurt', 'greek yogurt'],
  cream: ['heavy cream', 'whipping cream'],
  wine: ['white wine'],
  broth: ['vegetable broth', 'chicken broth'],
  pasta: ['spaghetti'],
  noodle: ['rice noodles', 'pad thai noodles'],
  eggplant: ['eggplants', 'aubergine'],
  zucchini: ['zucchinis'],
  potato: ['potatoes'],
  corn: ['corn kernels', 'sweet corn'],
  cabbage: ['cabbage slaw'],
  'sesame oil': ['toasted sesame oil'],
  'sesame seed': ['sesame seeds'],
  'green onion': ['green onions', 'scallions'],
  'curry paste': ['thai curry paste'],
  'fish sauce': ['nam pla'],
  tamarind: ['tamarind paste'],
  gochujang: ['korean chili paste'],
  mirin: ['rice wine mirin'],
  honey: ['raw honey'],
  'brown sugar': ['sugar'],
  paprika: ['smoked paprika'],
  cumin: ['ground cumin'],
  'garam masala': ['masala'],
  thyme: ['fresh thyme'],
  oregano: ['dried oregano'],
  'kalamata olive': ['kalamata olives', 'olives'],
  'kalamata olives': ['olives'],
  'romaine lettuce': ['romaine', 'lettuce'],
  romaine: ['romaine lettuce', 'lettuce head'],
  pancetta: ['bacon', 'pancetta or bacon'],
  bean: ['black beans', 'kidney beans'],
};

const QUALITATIVE_AMOUNT_PATTERN = /^(a\s+)?(pinch|dash|splash|sprinkle|handful|to taste|for garnish|as needed)/i;

function canonicalIngredientKey(name) {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, ' ');

  for (const [canonical, variants] of Object.entries(INGREDIENT_ALIASES)) {
    if (normalized === canonical) return canonical;
    if (variants.includes(normalized)) return canonical;
  }

  // Match when the canonical name is the core of a longer label (e.g. "fresh cilantro for garnish")
  for (const [canonical, variants] of Object.entries(INGREDIENT_ALIASES)) {
    if (normalized.includes(canonical)) return canonical;
    for (const variant of variants) {
      if (normalized.includes(variant)) return canonical;
    }
  }

  return normalized;
}

function displayIngredientName(canonicalKey, fallbackName) {
  if (fallbackName && fallbackName.trim()) {
    return capitalizeWords(fallbackName.trim());
  }
  return capitalizeWords(canonicalKey);
}

function parseFraction(valueStr) {
  const trimmed = valueStr.trim();
  if (trimmed.includes('/')) {
    const [numerator, denominator] = trimmed.split('/').map(Number);
    if (denominator) return numerator / denominator;
  }
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

function normalizeUnit(unit) {
  const u = (unit || '').toLowerCase().trim();
  const unitMap = {
    lb: 'lb',
    lbs: 'lb',
    pound: 'lb',
    pounds: 'lb',
    oz: 'oz',
    ounce: 'oz',
    ounces: 'oz',
    cup: 'cup',
    cups: 'cup',
    tbsp: 'tbsp',
    tablespoon: 'tbsp',
    tablespoons: 'tbsp',
    tsp: 'tsp',
    teaspoon: 'tsp',
    teaspoons: 'tsp',
    clove: 'clove',
    cloves: 'clove',
    can: 'can',
    cans: 'can',
    bunch: 'bunch',
    bunches: 'bunch',
    shell: 'shell',
    shells: 'shell',
    thigh: 'thigh',
    thighs: 'thigh',
    head: 'head',
    heads: 'head',
    floret: 'floret',
    florets: 'floret',
    ball: 'ball',
    balls: 'ball',
    slice: 'slice',
    slices: 'slice',
    bun: 'bun',
    buns: 'bun',
    bag: 'bag',
    bags: 'bag',
  };
  return unitMap[u] || u || 'count';
}

function parseAmount(amountStr) {
  const raw = amountStr.trim();
  const lower = raw.toLowerCase();

  if (!raw) return { type: 'unknown', raw };

  if (QUALITATIVE_AMOUNT_PATTERN.test(lower)) {
    return { type: 'qualitative', raw };
  }

  const numericPattern = /^([\d./]+)\s*(lbs?|pounds?|oz|ounces?|cups?|tbsp|tsp|teaspoons?|tablespoons?|cloves?|cans?|bunch(?:es)?|shells?|thighs?|head|florets?|balls?|slices?|buns?|bags?)?\s*(.*)$/i;
  const match = lower.match(numericPattern);

  if (!match) {
    return { type: 'unknown', raw };
  }

  const value = parseFraction(match[1]);
  if (value === null) return { type: 'unknown', raw };

  const unit = normalizeUnit(match[2]);
  const descriptor = (match[3] || '').trim();

  return {
    type: 'numeric',
    value,
    unit,
    descriptor,
    raw,
  };
}

function formatNumber(value) {
  if (Number.isInteger(value) || Math.abs(value % 1) < 0.001) {
    return String(Math.round(value));
  }
  if (value === 0.5) return '1/2';
  if (value === 0.25) return '1/4';
  if (value === 0.75) return '3/4';
  if (value === 1.5) return '1 1/2';
  return String(value);
}

function formatUnitLabel(unit, total) {
  const pluralMap = {
    cup: 'cups',
    tbsp: 'tbsp',
    tsp: 'tsp',
    clove: 'cloves',
    can: 'cans',
    bunch: 'bunches',
    shell: 'shells',
    thigh: 'thighs',
    head: 'heads',
    floret: 'florets',
    ball: 'balls',
    slice: 'slices',
    bun: 'buns',
    bag: 'bags',
    lb: 'lbs',
    oz: 'oz',
  };

  if (total === 1) return unit === 'count' ? '' : unit;
  return pluralMap[unit] || unit;
}

function pluralizeName(name, count) {
  const lower = name.toLowerCase();
  if (count === 1) return lower;

  if (lower.endsWith('y') && !lower.endsWith('ey')) {
    return `${lower.slice(0, -1)}ies`;
  }
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('ch')) {
    return lower;
  }
  return `${lower}s`;
}

function combineParsedAmounts(parsedAmounts, displayName) {
  const numericBuckets = new Map();
  const qualitative = [];
  const unknown = [];

  parsedAmounts.forEach((parsed) => {
    if (parsed.type === 'qualitative') {
      qualitative.push(parsed.raw);
      return;
    }
    if (parsed.type === 'unknown') {
      unknown.push(parsed.raw);
      return;
    }

    const bucketKey = `${parsed.unit}::${parsed.descriptor || ''}`;
    if (!numericBuckets.has(bucketKey)) {
      numericBuckets.set(bucketKey, {
        unit: parsed.unit,
        descriptor: parsed.descriptor,
        total: 0,
      });
    }
    numericBuckets.get(bucketKey).total += parsed.value;
  });

  const combinedParts = [];

  numericBuckets.forEach((bucket) => {
    const total = bucket.total;
    const unitLabel = formatUnitLabel(bucket.unit, total);

    if (bucket.unit === 'count') {
      const namePart = pluralizeName(displayName, total);
      if (bucket.descriptor) {
        combinedParts.push(`${formatNumber(total)} ${bucket.descriptor} ${namePart}`);
      } else {
        combinedParts.push(`${formatNumber(total)} ${namePart}`);
      }
    } else {
      combinedParts.push(`${formatNumber(total)} ${unitLabel}`.trim());
      if (bucket.descriptor) {
        combinedParts[combinedParts.length - 1] += ` ${bucket.descriptor}`;
      }
    }
  });

  if (qualitative.length > 0) {
    const uniqueQualitative = [...new Set(qualitative)];
    combinedParts.push(uniqueQualitative.join(' + '));
  }

  if (unknown.length > 0) {
    combinedParts.push(...[...new Set(unknown)]);
  }

  return combinedParts.join(' + ');
}

function groceryItemId(canonicalKey) {
  return canonicalKey.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function pruneCheckedGroceries(validIds) {
  const validSet = new Set(validIds);
  state.checkedGroceries.forEach((id) => {
    if (!validSet.has(id)) {
      state.checkedGroceries.delete(id);
    }
  });
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

  const quantityPattern = /^([\d./]+\s*(?:lbs?|pounds?|oz|ounces?|cups?|tbsp|tsp|teaspoons?|tablespoons?|cloves?|cans?|bunch(?:es)?|large|medium|small|bags?|shells?|slices?|buns?|thighs?|head|florets?|balls?)?\s*)(.+)$/i;
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
  return buildIngredientWithLeftover(parsed.name, parsed.amount);
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
    leftoversTips: CUSTOM_MEAL_LEFTOVER_TIP,
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

async function init() {
  bindNavigation();
  bindMealActions();
  bindGroceryActions();
  bindAddMealForm();
  bindStartFresh();
  renderMealGrid();

  await loadRecipes();
  loadFromStorage();
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
  if (!state.recipesLoaded) {
    mealGrid.innerHTML = '<p class="meal-grid-status">Loading recipes…</p>';
    return;
  }

  if (state.recipesError && state.recipeMeals.length === 0 && state.customMeals.length === 0) {
    mealGrid.innerHTML = `
      <p class="meal-grid-error">
        Could not load recipes.json (${escapeHtml(state.recipesError)}).
        Open this app through a local web server so the recipe file can load.
      </p>
    `;
    return;
  }

  const meals = getAllMeals();

  if (meals.length === 0) {
    mealGrid.innerHTML = '<p class="meal-grid-status">No meals available. Add your own using the form.</p>';
    return;
  }

  mealGrid.innerHTML = meals.map((meal) => {
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
          ${getMealTags(meal)}
          <h3 class="meal-name">${escapeHtml(meal.name)}</h3>
          <p class="meal-meta">${getMealMeta(meal)}</p>
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
      const canonicalKey = canonicalIngredientKey(ingredient.name);

      if (!ingredientMap.has(canonicalKey)) {
        ingredientMap.set(canonicalKey, {
          canonicalKey,
          displayName: displayIngredientName(canonicalKey, ingredient.name),
          parsedAmounts: [],
          rawAmounts: [],
          sources: [],
        });
      }

      const entry = ingredientMap.get(canonicalKey);
      entry.parsedAmounts.push(parseAmount(ingredient.amount));
      entry.rawAmounts.push(ingredient.amount);

      if (!entry.sources.includes(meal.name)) {
        entry.sources.push(meal.name);
      }
    });
  });

  const items = Array.from(ingredientMap.values()).map((entry) => {
    const combinedAmount = combineParsedAmounts(entry.parsedAmounts, entry.displayName);
    const id = groceryItemId(entry.canonicalKey);

    return {
      id,
      name: entry.displayName,
      amount: combinedAmount,
      sources: entry.sources,
      image: getIngredientImage(entry.displayName),
    };
  });

  pruneCheckedGroceries(items.map((item) => item.id));
  saveCheckedGroceries();

  return items.sort((a, b) => a.name.localeCompare(b.name));
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
      updateGroceryProgress(buildGroceryItems());
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

// ─── Leftover Magic: pantry saver tips from recipes.json ──────────────────────

function getPantrySavers() {
  return getSelectedMeals()
    .filter((meal) => meal.leftoversTips)
    .map((meal) => ({
      name: meal.name,
      image: meal.image || DEFAULT_INGREDIENT_IMAGE,
      type: meal.type,
      country: meal.country,
      tip: meal.leftoversTips,
      isCustom: meal.isCustom,
    }));
}

function renderPantrySaverCard(item) {
  const tags = ['<span class="pantry-saver-tag pantry-saver-tag--idea">Pantry saver</span>'];

  if (item.isCustom) {
    tags.push('<span class="pantry-saver-tag">Your meal</span>');
  } else if (item.type) {
    tags.push(`<span class="pantry-saver-tag">${escapeHtml(item.type)}</span>`);
  }
  if (item.country) {
    tags.push(`<span class="pantry-saver-tag">${escapeHtml(item.country)}</span>`);
  }

  return `
    <li class="pantry-saver-card" role="listitem">
      <img
        class="pantry-saver-thumb"
        src="${item.image}"
        alt=""
        width="72"
        height="72"
        loading="lazy"
      >
      <div class="pantry-saver-body">
        <h3 class="pantry-saver-meal">${escapeHtml(item.name)}</h3>
        <div class="pantry-saver-tags">${tags.join('')}</div>
        <p class="pantry-saver-tip">${escapeHtml(item.tip)}</p>
      </div>
    </li>
  `;
}

/**
 * Scans ingredients with partial usage to estimate likely leftovers.
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

function renderDetectedLeftovers(leftovers) {
  if (!leftoverList) return;

  if (leftoverCount) {
    leftoverCount.textContent =
      leftovers.length > 0
        ? `${leftovers.length} ingredient${leftovers.length === 1 ? '' : 's'} you may have left`
        : 'Ingredients you may have left after cooking';
  }

  leftoverList.innerHTML =
    leftovers.length === 0
      ? '<li class="leftover-empty-msg">No partial ingredients detected for these meals.</li>'
      : leftovers
          .map(
            (item) => `
            <li>
              <img class="leftover-thumb" src="${item.image}" alt="" width="48" height="48" loading="lazy">
              <div class="leftover-details">
                <span class="leftover-amount">${escapeHtml(item.remaining)}</span>
                <span class="leftover-name">${escapeHtml(item.name)}</span>
                <span class="leftover-from">from ${escapeHtml(item.meals.join(', '))}</span>
              </div>
            </li>
          `
          )
          .join('');
}

function clearLeftoverMagicViews() {
  if (pantrySaversList) pantrySaversList.innerHTML = '';
  if (pantrySaversCount) pantrySaversCount.textContent = 'Bonus recipe ideas from your selected meals';
  if (leftoverList) leftoverList.innerHTML = '';
  if (detectedLeftoversPanel) detectedLeftoversPanel.hidden = true;
}

function renderLeftoverMagic() {
  const hasMeals = state.selectedMealIds.size > 0;
  leftoverEmpty.hidden = hasMeals;
  leftoverPanel.hidden = !hasMeals;

  if (!hasMeals) {
    clearLeftoverMagicViews();
    return;
  }

  const pantrySavers = getPantrySavers();

  if (pantrySaversCount) {
    pantrySaversCount.textContent =
      pantrySavers.length > 0
        ? `${pantrySavers.length} bonus recipe idea${pantrySavers.length === 1 ? '' : 's'} from your meals`
        : 'Select recipe meals to unlock pantry saver tips';
  }

  if (pantrySaversList) {
    pantrySaversList.innerHTML =
      pantrySavers.length > 0
        ? pantrySavers.map(renderPantrySaverCard).join('')
        : '<li class="pantry-saver-empty">No pantry saver tips found for your current selection.</li>';
  }

  const leftovers = detectLeftovers();

  if (detectedLeftoversPanel) {
    detectedLeftoversPanel.hidden = leftovers.length === 0;
  }

  renderDetectedLeftovers(leftovers);
}

// ─── Sync all views when selection changes ────────────────────────────────────

function updateAllViews() {
  renderMealGrid();
  updateSelectionSummary();
  renderGroceryList();
  renderLeftoverMagic();
}

document.addEventListener('DOMContentLoaded', init);
