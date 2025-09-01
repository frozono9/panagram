// Progressive autocomplete system that creates "paths" to magic categories
// Each letter progression leads towards magic categories while providing variety

// Magic categories from magicData
const MAGIC_CATEGORIES = [
  'landmarks', 'animals', 'foods', 'celebrities', 'brands', 
  'movies', 'countries', 'cities', 'superheroes', 'objects', 
  'sports', 'vehicles'
];

// Progressive autocomplete paths - each category gets a carefully crafted path
const AUTOCOMPLETE_PATHS = {
  // ANIMALS path (A -> AN -> ANI -> ANIM -> ANIMA -> ANIMALS)
  'a': ['Art', 'Architecture', 'Australia', 'Apple', 'Animals'],
  'an': ['Animals', 'Antarctica', 'Angel', 'Anime', 'Ancient'],
  'ani': ['Animals', 'Animation', 'Anime', 'Anniversary', 'Animal'],
  'anim': ['Animals', 'Animation', 'Animal Kingdom', 'Anime Movies', 'Animal Sounds'],
  'anima': ['Animals', 'Animation', 'Animal Planet', 'Animal Rights', 'Animal Photos'],
  'animal': ['Animals', 'Animal Kingdom', 'Animal Planet', 'Animal Rights', 'Animal Photos'],
  
  // BRANDS path (B -> BR -> BRA -> BRAN -> BRAND -> BRANDS)
  'b': ['Brands', 'Basketball', 'Brazil', 'Berlin', 'Batman'],
  'br': ['Brands', 'Brazil', 'British', 'Broadway', 'Brooklyn'],
  'bra': ['Brands', 'Brazil', 'Brand Names', 'Branding', 'Brave'],
  'bran': ['Brands', 'Brand Names', 'Branding', 'Branch', 'Brandon'],
  'brand': ['Brands', 'Brand Names', 'Branding', 'Brand Identity', 'Brand Design'],
  
  // CELEBRITIES path (C -> CE -> CEL -> CELE -> CELEB -> CELEBR -> CELEBRI -> CELEBRIT -> CELEBRITIES)
  'c': ['Cities', 'Countries', 'Celebrities', 'Cars', 'Coffee'],
  'ce': ['Celebrities', 'Central Park', 'Celtic', 'Ceremony', 'Ceramic'],
  'cel': ['Celebrities', 'Celtic', 'Cell Phone', 'Celebrity', 'Celestial'],
  'cele': ['Celebrities', 'Celebrity', 'Celebrity News', 'Celebration', 'Celestial'],
  'celeb': ['Celebrities', 'Celebrity', 'Celebrity News', 'Celebrity Photos', 'Celebrity Style'],
  'celebr': ['Celebrities', 'Celebrity', 'Celebration', 'Celebrity News', 'Celebrity Photos'],
  'celebri': ['Celebrities', 'Celebrity', 'Celebrity News', 'Celebrity Photos', 'Celebrity Style'],
  'celebrit': ['Celebrities', 'Celebrity Photos', 'Celebrity News', 'Celebrity Style', 'Celebrity Gossip'],
  'celebriti': ['Celebrities', 'Celebrity Photos', 'Celebrity News', 'Celebrity Style', 'Celebrity Gossip'],
  'celebritie': ['Celebrities', 'Celebrity Photos', 'Celebrity News', 'Celebrity Style', 'Celebrity Gossip'],
  
  // CITIES path (CI -> CIT -> CITI -> CITIE -> CITIES)
  'ci': ['Cities', 'Cinema', 'Circle', 'City', 'Civil'],
  'cit': ['Cities', 'City', 'Citizen', 'Citation', 'Citrus'],
  'citi': ['Cities', 'City Life', 'Citizen', 'City Planning', 'City Views'],
  'citie': ['Cities', 'City Life', 'City Views', 'City Planning', 'City Tours'],
  
  // COUNTRIES path (CO -> COU -> COUN -> COUNT -> COUNTR -> COUNTRI -> COUNTRIES)
  'co': ['Countries', 'Coffee', 'Computer', 'Colors', 'Comedy'],
  'cou': ['Countries', 'Country', 'Couch', 'Course', 'Court'],
  'coun': ['Countries', 'Country', 'Count', 'Counter', 'Council'],
  'count': ['Countries', 'Country', 'Count', 'Counter', 'Counting'],
  'countr': ['Countries', 'Country', 'Country Music', 'Countryside', 'Country Life'],
  'countri': ['Countries', 'Country Music', 'Countryside', 'Country Life', 'Country Roads'],
  'countrie': ['Countries', 'Country Music', 'Countryside', 'Country Life', 'Country Roads'],
  
  // FOODS path (F -> FO -> FOO -> FOOD -> FOODS)
  'f': ['Foods', 'France', 'Football', 'Fashion', 'Flowers'],
  'fo': ['Foods', 'Football', 'Forest', 'Formula', 'Force'],
  'foo': ['Foods', 'Football', 'Food Network', 'Footwear', 'Footage'],
  'food': ['Foods', 'Food Network', 'Food Photography', 'Food Culture', 'Food Recipes'],
  
  // LANDMARKS path (L -> LA -> LAN -> LAND -> LANDM -> LANDMA -> LANDMAR -> LANDMARK -> LANDMARKS)
  'l': ['Landmarks', 'London', 'Leonardo DiCaprio', 'Lion', 'Laptop'],
  'la': ['Landmarks', 'London', 'Landscape', 'Language', 'Las Vegas'],
  'lan': ['Landmarks', 'Landscape', 'Language', 'Landing', 'Land'],
  'land': ['Landmarks', 'Landscape', 'Landing', 'Land', 'Landlord'],
  'landm': ['Landmarks', 'Landmark', 'Landmark Photos', 'Landmark Tours', 'Landmark History'],
  'landma': ['Landmarks', 'Landmark Photos', 'Landmark Tours', 'Landmark History', 'Landmark Guide'],
  'landmar': ['Landmarks', 'Landmark Photos', 'Landmark Tours', 'Landmark History', 'Landmark Guide'],
  'landmark': ['Landmarks', 'Landmark Photos', 'Landmark Tours', 'Landmark History', 'Landmark Guide'],
  
  // MOVIES path (M -> MO -> MOV -> MOVI -> MOVIE -> MOVIES)
  'm': ['Movies', 'Music', 'Mountains', 'Michael Jackson', 'Madrid'],
  'mo': ['Movies', 'Music', 'Mountains', 'Modern', 'Money'],
  'mov': ['Movies', 'Movie Reviews', 'Movie Trailers', 'Movement', 'Moving'],
  'movi': ['Movies', 'Movie Reviews', 'Movie Trailers', 'Movie Stars', 'Movie Theater'],
  'movie': ['Movies', 'Movie Reviews', 'Movie Trailers', 'Movie Stars', 'Movie Theater'],
  
  // OBJECTS path (O -> OB -> OBJ -> OBJE -> OBJEC -> OBJECT -> OBJECTS)
  'o': ['Objects', 'Ocean', 'Orange', 'Office', 'Olympic'],
  'ob': ['Objects', 'Ocean', 'Objective', 'Observatory', 'Obstacle'],
  'obj': ['Objects', 'Objective', 'Object Art', 'Object Design', 'Object Photos'],
  'obje': ['Objects', 'Objective', 'Object Art', 'Object Design', 'Object Photos'],
  'objec': ['Objects', 'Object Art', 'Object Design', 'Object Photos', 'Object Collection'],
  'object': ['Objects', 'Object Art', 'Object Design', 'Object Photos', 'Object Collection'],
  
  // SPORTS path (S -> SP -> SPO -> SPOR -> SPORT -> SPORTS)
  's': ['Sports', 'Superheroes', 'Spain', 'Superman', 'Sunset'],
  'sp': ['Sports', 'Spain', 'Space', 'Special', 'Spring'],
  'spo': ['Sports', 'Spotlight', 'Sport Cars', 'Sports News', 'Sports Photos'],
  'spor': ['Sports', 'Sports News', 'Sports Photos', 'Sports Equipment', 'Sports Cars'],
  'sport': ['Sports', 'Sports News', 'Sports Photos', 'Sports Equipment', 'Sports Cars'],
  
  // SUPERHEROES path (SU -> SUP -> SUPE -> SUPER -> SUPERH -> SUPERHE -> SUPERHER -> SUPERHERO -> SUPERHEROE -> SUPERHEROES)
  'su': ['Superheroes', 'Superman', 'Sunset', 'Summer', 'Sunday'],
  'sup': ['Superheroes', 'Superman', 'Support', 'Supply', 'Supermarket'],
  'supe': ['Superheroes', 'Superman', 'Super Bowl', 'Supermarket', 'Superior'],
  'super': ['Superheroes', 'Superman', 'Super Bowl', 'Supermarket', 'Superior'],
  'superh': ['Superheroes', 'Superman', 'Super Heroes', 'Superhero Movies', 'Superhero Comics'],
  'superhe': ['Superheroes', 'Superhero Movies', 'Superhero Comics', 'Superhero Art', 'Superhero Costumes'],
  'superher': ['Superheroes', 'Superhero Movies', 'Superhero Comics', 'Superhero Art', 'Superhero Costumes'],
  'superhero': ['Superheroes', 'Superhero Movies', 'Superhero Comics', 'Superhero Art', 'Superhero Costumes'],
  'superheroe': ['Superheroes', 'Superhero Movies', 'Superhero Comics', 'Superhero Art', 'Superhero Costumes'],
  
  // VEHICLES path (V -> VE -> VEH -> VEHI -> VEHIC -> VEHICL -> VEHICLE -> VEHICLES)
  'v': ['Vehicles', 'Venice', 'Vintage', 'Video', 'Victory'],
  've': ['Vehicles', 'Venice', 'Vintage', 'Vector', 'Vegetable'],
  'veh': ['Vehicles', 'Vehicle Photos', 'Vehicle Design', 'Vehicle History', 'Vehicle Types'],
  'vehi': ['Vehicles', 'Vehicle Photos', 'Vehicle Design', 'Vehicle History', 'Vehicle Types'],
  'vehic': ['Vehicles', 'Vehicle Photos', 'Vehicle Design', 'Vehicle History', 'Vehicle Types'],
  'vehicl': ['Vehicles', 'Vehicle Photos', 'Vehicle Design', 'Vehicle History', 'Vehicle Types'],
  'vehicle': ['Vehicles', 'Vehicle Photos', 'Vehicle Design', 'Vehicle History', 'Vehicle Types'],
};

// Function to get filtered suggestions based on input
export const getFilteredSuggestions = (input, maxResults = 5) => {
  if (!input || input.length < 1) {
    // Return popular magic categories when no input
    return ['Sports', 'Foods', 'Animals', 'Movies', 'Cities'];
  }
  
  const lowercaseInput = input.toLowerCase().trim();
  
  // Check if we have a specific path for this input
  if (AUTOCOMPLETE_PATHS[lowercaseInput]) {
    return AUTOCOMPLETE_PATHS[lowercaseInput].slice(0, maxResults);
  }
  
  // If no exact path match, find the closest match by reducing input length
  let currentInput = lowercaseInput;
  while (currentInput.length > 0) {
    if (AUTOCOMPLETE_PATHS[currentInput]) {
      // Found a path, but filter results to only show those that start with the original input
      const pathSuggestions = AUTOCOMPLETE_PATHS[currentInput];
      const filtered = pathSuggestions.filter(suggestion => 
        suggestion.toLowerCase().startsWith(lowercaseInput)
      );
      
      if (filtered.length >= maxResults) {
        return filtered.slice(0, maxResults);
      } else {
        // If not enough filtered results, supplement with path suggestions
        const remaining = maxResults - filtered.length;
        const supplements = pathSuggestions.filter(suggestion => 
          !suggestion.toLowerCase().startsWith(lowercaseInput)
        ).slice(0, remaining);
        return [...filtered, ...supplements];
      }
    }
    currentInput = currentInput.slice(0, -1);
  }
  
  // Fallback: find any suggestions that start with the input
  const fallbackSuggestions = [];
  
  // First, check all path values for matches
  Object.values(AUTOCOMPLETE_PATHS).forEach(pathArray => {
    pathArray.forEach(suggestion => {
      if (suggestion.toLowerCase().startsWith(lowercaseInput) && 
          !fallbackSuggestions.includes(suggestion)) {
        fallbackSuggestions.push(suggestion);
      }
    });
  });
  
  return fallbackSuggestions.slice(0, maxResults);
};

// Function to check if a suggestion is a magic category
export const isMagicCategory = (suggestion) => {
  return MAGIC_CATEGORIES.includes(suggestion.toLowerCase());
};

// Export magic categories for reference
export { MAGIC_CATEGORIES };
