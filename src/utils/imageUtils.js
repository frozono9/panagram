// Map search terms to image folder categories
const SEARCH_TO_FOLDER_MAP = {
  // Direct matches
  'sports': 'sports',
  'animals': 'animals', 
  'foods': 'foods',
  'food': 'foods',
  'celebrities': 'celebrities',
  'celebrity': 'celebrities',
  'brands': 'brands',
  'brand': 'brands',
  'movies': 'movies',
  'movie': 'movies',
  'countries': 'countries',
  'country': 'countries',
  'cities': 'cities',
  'city': 'cities',
  'landmarks': 'landmarks',
  'landmark': 'landmarks',
  'objects': 'objects',
  'object': 'objects',
  'superheroes': 'superheroes',
  'superhero': 'superheroes',
  'vehicles': 'vehicles',
  'vehicle': 'vehicles',
  
  // Common search variations and synonyms
  'actors': 'celebrities',
  'actor': 'celebrities',
  'famous people': 'celebrities',
  'stars': 'celebrities',
  'wildlife': 'animals',
  'pets': 'animals',
  'nature': 'animals',
  'dining': 'foods',
  'cuisine': 'foods',
  'cooking': 'foods',
  'recipes': 'foods',
  'companies': 'brands',
  'logos': 'brands',
  'business': 'brands',
  'films': 'movies',
  'cinema': 'movies',
  'hollywood': 'movies',
  'entertainment': 'movies',
  'nations': 'countries',
  'travel': 'cities',
  'tourism': 'landmarks',
  'monuments': 'landmarks',
  'architecture': 'landmarks',
  'things': 'objects',
  'items': 'objects',
  'stuff': 'objects',
  'heroes': 'superheroes',
  'marvel': 'superheroes',
  'dc': 'superheroes',
  'comics': 'superheroes',
  'cars': 'vehicles',
  'transportation': 'vehicles',
  'planes': 'vehicles',
  'trucks': 'vehicles',
  'athletics': 'sports',
  'games': 'sports',
  'competition': 'sports',
  'fitness': 'sports'
};

// Fisher-Yates shuffle algorithm to mix images properly
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get available images from a specific folder
const getImagesFromFolder = async (folderName) => {
  try {
    const imageInventory = getImageInventory();
    
    if (imageInventory[folderName] && imageInventory[folderName].length > 0) {
      const images = imageInventory[folderName].map((filename, index) => ({
        id: `${folderName}_${index}`,
        url: `/images/${folderName}/${filename}`,
        title: generateImageTitle(folderName, filename),
        width: 300 + Math.floor(Math.random() * 200), // Random width for masonry effect
        height: 200 + Math.floor(Math.random() * 300), // Random height for masonry effect
      }));
      
      // Shuffle the images to ensure good mixing
      return shuffleArray(images);
    } else {
      // If folder is empty, generate placeholder images with appropriate content
      return generatePlaceholderImages(folderName, 20);
    }
  } catch (error) {
    console.warn(`Could not load images from folder: ${folderName}`, error);
    return generatePlaceholderImages(folderName, 20);
  }
};

// Generate placeholder images for empty folders
const generatePlaceholderImages = (folderName, count) => {
  const images = [];
  const folderColors = {
    sports: '#ff6b6b',
    animals: '#4ecdc4', 
    foods: '#45b7d1',
    celebrities: '#96ceb4',
    brands: '#ffeaa7',
    movies: '#dda0dd',
    countries: '#98d8c8',
    cities: '#f7dc6f',
    landmarks: '#bb8fce',
    objects: '#85c1e9',
    superheroes: '#f8c471',
    vehicles: '#82e0aa'
  };
  
  const color = folderColors[folderName] || '#cccccc';
  const folderDisplayNames = {
    sports: 'Sports',
    animals: 'Animals', 
    foods: 'Food',
    celebrities: 'Celebrity',
    brands: 'Brand',
    movies: 'Movie',
    countries: 'Country',
    cities: 'City',
    landmarks: 'Landmark',
    objects: 'Object',
    superheroes: 'Superhero',
    vehicles: 'Vehicle'
  };
  
  const displayName = folderDisplayNames[folderName] || folderName;
  
  for (let i = 1; i <= count; i++) {
    const paddedNumber = i.toString().padStart(2, '0');
    const filename = `${displayName}${paddedNumber}.jpg`;
    images.push({
      id: `${folderName}_placeholder_${i}`,
      url: `https://via.placeholder.com/${400 + (i * 10)}x${300 + (i * 15)}/${color.replace('#', '')}/ffffff?text=${encodeURIComponent(displayName)}+${i}`,
      title: generateImageTitle(folderName, filename),
      width: 400 + (i * 10),
      height: 300 + (i * 15)
    });
  }
  
  return images;
};

// Generate appropriate title for an image based on its folder and filename
const generateImageTitle = (folderName, filename) => {
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  
  // Create realistic Google Images style titles
  const realisticTitles = {
    sports: {
      'Baseball01': 'Top 10 Baseball Players of All Time - ESPN',
      'Baseball02': 'MLB World Series 2024 Highlights - Sports Illustrated',
      'Baseball03': 'How to Throw a Perfect Curveball - Baseball Digest',
      'Baseball04': 'Yankees vs Red Sox Classic Moments - MLB.com',
      'Baseball05': 'Baseball Equipment Guide 2024 - Dick\'s Sporting Goods',
      'Baseball06': 'Little League World Series Champions - ESPN',
      'Baseball07': 'Best Baseball Stadiums in America - Travel Channel',
      'Baseball08': 'Baseball Rules and Regulations - Official MLB Guide',
      'Baseball09': 'Greatest Baseball Comebacks in History - Sports Center',
      'Baseball10': 'Baseball Training Tips for Beginners - Coach\'s Corner',
      
      'Basketball01': 'NBA Finals 2024 Game Highlights - NBA.com',
      'Basketball02': 'LeBron James Career Statistics - Basketball Reference',
      'Basketball03': 'Best Basketball Shoes 2024 Review - Sneaker News',
      'Basketball04': 'March Madness Bracket Predictions - CBS Sports',
      'Basketball05': 'How to Shoot a Perfect Free Throw - Coach Mike',
      'Basketball06': 'NBA Draft 2024 Top Prospects - The Athletic',
      'Basketball07': 'Lakers vs Warriors Historic Rivalry - ESPN',
      'Basketball08': 'Basketball Court Dimensions Guide - Sports Venue',
      'Basketball09': 'WNBA Championship Game Recap - ESPN W',
      'Basketball10': 'Youth Basketball Development Program - USA Basketball',
      
      'Boxing01': 'Muhammad Ali Greatest Fights - Boxing News',
      'Boxing02': 'How to Throw a Proper Jab - Boxing Technique',
      'Boxing03': 'Heavyweight Championship History - Ring Magazine',
      'Boxing04': 'Boxing Training Equipment Guide - Everlast',
      'Boxing05': 'Women\'s Boxing Rising Stars - ESPN',
      'Boxing06': 'Olympic Boxing Rules Explained - International Boxing',
      'Boxing07': 'Best Boxing Gyms in Your City - Yelp Reviews',
      'Boxing08': 'Boxing vs MMA: Key Differences - Combat Sports',
      'Boxing09': 'Professional Boxing Career Guide - Boxing Coach',
      'Boxing10': 'Boxing Safety Equipment Essentials - Sports Safety',
      
      'Chess01': 'World Chess Championship 2024 - Chess.com',
      'Chess02': 'Magnus Carlsen Best Games Analysis - ChessBase',
      'Chess03': 'Chess Opening Strategies for Beginners - Chess Tactics',
      'Chess04': 'How to Checkmate in 4 Moves - Chess Lessons',
      'Chess05': 'Online Chess Tournament Results - Lichess.org',
      'Chess06': 'Chess Set Collection Vintage Pieces - Antique Chess',
      'Chess07': 'Chess Psychology and Mind Games - Psychology Today',
      'Chess08': 'Chess AI vs Human Players - Tech Review',
      'Chess09': 'Chess Puzzles Daily Challenge - Chess Puzzle',
      'Chess10': 'Famous Chess Players Throughout History - Chess History',
      
      'Football01': 'NFL Super Bowl 2024 Recap - NFL.com',
      'Football02': 'College Football Playoff Rankings - ESPN College',
      'Football03': 'Tom Brady Retirement Ceremony - Sports News',
      'Football04': 'NFL Draft Pick Analysis 2024 - Pro Football Focus',
      'Football05': 'Best Football Stadiums Worldwide - Stadium Guide',
      'Football06': 'Football Training Drills for Speed - Athletic Performance',
      'Football07': 'High School Football Championship - Local Sports',
      'Football08': 'NFL Salary Cap Explained - Forbes Sports',
      'Football09': 'Women\'s Football League Growth - Title IX Sports',
      'Football10': 'Fantasy Football Draft Strategy - Fantasy Sports',
      
      'Golf01': 'Masters Tournament 2024 Winner - Golf Digest',
      'Golf02': 'Tiger Woods Comeback Story - Golf Channel',
      'Golf03': 'Best Golf Courses in Scotland - Golf Travel',
      'Golf04': 'Golf Swing Technique Analysis - PGA Teaching Pro',
      'Golf05': 'Golf Equipment Reviews 2024 - Golf Magazine',
      'Golf06': 'Women\'s Golf Major Championships - LPGA Tour',
      'Golf07': 'Golf Rules and Etiquette Guide - USGA',
      'Golf08': 'Golf Course Design Principles - Golf Architect',
      'Golf09': 'Junior Golf Development Programs - PGA Youth',
      'Golf10': 'Golf Fitness Training Routine - Golf Fitness Magazine',
      
      'Gymnastics01': 'Olympic Gymnastics Results 2024 - Olympics.com',
      'Gymnastics02': 'Simone Biles Training Routine - USA Gymnastics',
      'Gymnastics03': 'Gymnastics Equipment for Home - Gymnastics Supply',
      'Gymnastics04': 'Men\'s Gymnastics Championship - International Gymnastics',
      'Gymnastics05': 'Gymnastics Injury Prevention Tips - Sports Medicine',
      'Gymnastics06': 'Rhythmic Gymnastics World Cup - FIG Gymnastics',
      'Gymnastics07': 'Youth Gymnastics Programs Near You - Local Gymnastics',
      'Gymnastics08': 'Gymnastics Scoring System Explained - Gymnastics Guide',
      'Gymnastics09': 'Gymnastics Flexibility Training - Athletic Training',
      'Gymnastics10': 'College Gymnastics Championships - NCAA Gymnastics',
      
      'Hockey01': 'NHL Stanley Cup Finals 2024 - NHL.com',
      'Hockey02': 'Wayne Gretzky Career Highlights - Hockey Hall of Fame',
      'Hockey03': 'Hockey Equipment Buying Guide - Hockey Gear',
      'Hockey04': 'Women\'s Hockey World Championship - IIHF',
      'Hockey05': 'Youth Hockey Development League - USA Hockey',
      'Hockey06': 'Hockey Rules for Beginners - Learn Hockey',
      'Hockey07': 'Best Hockey Arenas in North America - Arena Guide',
      'Hockey08': 'Hockey Training Off-Season Program - Hockey Training',
      'Hockey09': 'Olympic Hockey Tournament Results - Olympic Hockey',
      'Hockey10': 'Hockey Statistics Analysis Tools - Hockey Analytics',
      
      'Rugby01': 'Rugby World Cup 2024 Results - World Rugby',
      'Rugby02': 'Rugby vs American Football Differences - Sports Compare',
      'Rugby03': 'Rugby Training Fitness Program - Rugby Fitness',
      'Rugby04': 'Women\'s Rugby Growth Worldwide - World Rugby Women',
      'Rugby05': 'Rugby Rules Explained Simply - Rugby Basics',
      'Rugby06': 'Best Rugby Players of All Time - Rugby History',
      'Rugby07': 'Rugby Injury Prevention Guide - Sports Medicine',
      'Rugby08': 'Youth Rugby Development Programs - Local Rugby',
      'Rugby09': 'Rugby Equipment and Gear Guide - Rugby Store',
      'Rugby10': 'Rugby Sevens Tournament Highlights - Rugby Sevens',
      
      'Swimming01': 'Olympic Swimming Records 2024 - Swimming World',
      'Swimming02': 'Swimming Technique Improvement Tips - Swim Coach',
      'Swimming03': 'Best Swimming Pools for Training - Aquatic Centers',
      'Swimming04': 'Swimming Equipment Reviews - Swim Gear',
      'Swimming05': 'Youth Swimming Lessons Programs - Learn to Swim',
      'Swimming06': 'Swimming Workout Routines - Fitness Swimming',
      'Swimming07': 'Open Water Swimming Safety Tips - Triathlon Swimming',
      'Swimming08': 'Swimming Stroke Analysis - Swim Technique',
      'Swimming09': 'Masters Swimming Competitions - Adult Swimming',
      'Swimming10': 'Swimming Pool Maintenance Guide - Pool Care',
      
      'Tennis01': 'Wimbledon 2024 Championship Finals - Tennis.com',
      'Tennis02': 'Serena Williams Greatest Matches - WTA Tennis',
      'Tennis03': 'Tennis Racket Buying Guide 2024 - Tennis Warehouse',
      'Tennis04': 'French Open Clay Court Strategy - Roland Garros',
      'Tennis05': 'Tennis Lessons for Beginners - Tennis Academy',
      'Tennis06': 'US Open Tournament Schedule - US Open Tennis',
      'Tennis07': 'Tennis Fitness Training Program - Athletic Performance',
      'Tennis08': 'Tennis Court Surface Types Explained - Tennis Courts',
      'Tennis09': 'Junior Tennis Development Programs - USTA Junior',
      'Tennis10': 'Tennis Psychology Mental Game - Sports Psychology',
      
      'Volleyball01': 'Olympic Volleyball Championships - FIVB',
      'Volleyball02': 'Beach Volleyball Tournament Results - AVP Tour',
      'Volleyball03': 'Volleyball Rules and Regulations - USA Volleyball',
      'Volleyball04': 'College Volleyball Championship - NCAA Volleyball',
      'Volleyball05': 'Volleyball Training Drills - Volleyball Coach',
      'Volleyball06': 'Women\'s Professional Volleyball - Pro Volleyball',
      'Volleyball07': 'Youth Volleyball League Registration - Local Volleyball',
      'Volleyball08': 'Volleyball Equipment and Net Setup - Sports Equipment',
      'Volleyball09': 'Volleyball Serving Techniques - Volleyball Skills',
      'Volleyball10': 'Indoor vs Beach Volleyball Differences - Volleyball Guide'
    }
  };
  
  // Get sport-specific titles or create generic ones
  if (realisticTitles[folderName] && realisticTitles[folderName][baseName]) {
    return realisticTitles[folderName][baseName];
  }
  
  // Fallback for other categories or missing titles
  const genericTitleTemplates = {
    sports: [
      `${baseName} Training Tips and Techniques - Sports Coach`,
      `${baseName} Equipment Reviews 2024 - Sports Gear`,
      `${baseName} Championship Results - Sports News`,
      `${baseName} Rules and Regulations Guide - Official Sports`,
      `${baseName} Player Statistics - Sports Database`,
      `${baseName} Workout Routines - Athletic Training`,
      `${baseName} History and Origins - Sports History`,
      `${baseName} Youth Programs Near You - Local Sports`
    ],
    animals: [
      `${baseName} Wildlife Photography - National Geographic`,
      `${baseName} Animal Facts and Habitat - Animal Planet`,
      `${baseName} Conservation Efforts - Wildlife Protection`,
      `${baseName} Zoo Animals Live Cam - Zoo Wildlife`,
      `${baseName} Animal Behavior Studies - Nature Research`
    ],
    foods: [
      `${baseName} Recipe Collection - Food Network`,
      `${baseName} Restaurant Reviews - Yelp Food`,
      `${baseName} Cooking Techniques - Chef's Kitchen`,
      `${baseName} Nutritional Information - Health Food Guide`,
      `${baseName} Cultural Cuisine History - Food Culture`
    ],
    celebrities: [
      `${baseName} Latest News and Updates - Entertainment Tonight`,
      `${baseName} Red Carpet Fashion - Style Magazine`,
      `${baseName} Interview Highlights - Celebrity Talk`,
      `${baseName} Career Timeline - Biography.com`,
      `${baseName} Social Media Updates - Celebrity News`
    ],
    movies: [
      `${baseName} Movie Review and Rating - IMDb`,
      `${baseName} Box Office Results - Variety`,
      `${baseName} Behind the Scenes Footage - Movie Insider`,
      `${baseName} Cast and Crew Information - Hollywood Reporter`,
      `${baseName} Streaming Availability - Where to Watch`
    ]
  };
  
  if (genericTitleTemplates[folderName]) {
    const templates = genericTitleTemplates[folderName];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
  }
  
  // Final fallback
  return `${baseName} - Popular Images and Information`;
};

// Define the available images for each category (since we can't read directories dynamically)
const getImageInventory = () => {
  return {
    sports: [
      'Baseball01.jpg', 'Baseball02.jpg', 'Baseball03.jpg', 'Baseball04.jpg', 'Baseball05.jpg',
      'Baseball06.jpg', 'Baseball07.jpg', 'Baseball08.jpg', 'Baseball09.jpg', 'Baseball10.jpg',
      'Basketball01.jpg', 'Basketball02.jpg', 'Basketball03.jpg', 'Basketball04.jpg', 'Basketball05.jpg',
      'Basketball06.jpg', 'Basketball07.jpg', 'Basketball08.jpg', 'Basketball09.jpg', 'Basketball10.jpg',
      'Boxing01.jpg', 'Boxing02.jpg', 'Boxing03.jpg', 'Boxing04.jpg', 'Boxing05.jpg',
      'Boxing06.jpg', 'Boxing07.jpg', 'Boxing08.jpg', 'Boxing09.jpg', 'Boxing10.jpg',
      'Chess01.jpg', 'Chess02.jpg', 'Chess03.jpg', 'Chess04.jpg', 'Chess05.jpg',
      'Chess06.jpg', 'Chess07.jpg', 'Chess08.jpg', 'Chess09.jpg', 'Chess10.jpg',
      'Football01.jpg', 'Football02.jpg', 'Football03.jpg', 'Football04.jpg', 'Football05.jpg',
      'Football06.jpg', 'Football07.jpg', 'Football08.jpg', 'Football09.jpg', 'Football10.jpg',
      'Golf01.jpg', 'Golf02.jpg', 'Golf03.jpg', 'Golf04.jpg', 'Golf05.jpg',
      'Golf06.jpg', 'Golf07.jpg', 'Golf08.jpg', 'Golf09.jpg', 'Golf10.jpg',
      'Gymnastics01.jpg', 'Gymnastics02.jpg', 'Gymnastics03.jpg', 'Gymnastics04.jpg', 'Gymnastics05.jpg',
      'Gymnastics06.jpg', 'Gymnastics07.jpg', 'Gymnastics08.jpg', 'Gymnastics09.jpg', 'Gymnastics10.jpg',
      'Hockey01.jpg', 'Hockey02.jpg', 'Hockey03.jpg', 'Hockey04.jpg', 'Hockey05.jpg',
      'Hockey06.jpg', 'Hockey07.jpg', 'Hockey08.jpg', 'Hockey09.jpg', 'Hockey10.jpg',
      'Rugby01.jpg', 'Rugby02.jpg', 'Rugby03.jpg', 'Rugby04.jpg', 'Rugby05.jpg',
      'Rugby06.jpg', 'Rugby07.jpg', 'Rugby08.jpg', 'Rugby09.jpg', 'Rugby10.jpg',
      'Swimming01.jpg', 'Swimming02.jpg', 'Swimming03.jpg', 'Swimming04.jpg', 'Swimming05.jpg',
      'Swimming06.jpg', 'Swimming07.jpg', 'Swimming08.jpg', 'Swimming09.jpg', 'Swimming10.jpg',
      'Tennis01.jpg', 'Tennis02.jpg', 'Tennis03.jpg', 'Tennis04.jpg', 'Tennis05.jpg',
      'Tennis06.jpg', 'Tennis07.jpg', 'Tennis08.jpg', 'Tennis09.jpg', 'Tennis10.jpg',
      'Volleyball01.jpg', 'Volleyball02.jpg', 'Volleyball03.jpg', 'Volleyball04.jpg', 'Volleyball05.jpg',
      'Volleyball06.jpg', 'Volleyball07.jpg', 'Volleyball08.jpg', 'Volleyball09.jpg', 'Volleyball10.jpg'
    ],
    animals: [
      'Crocodile01.jpg', 'Crocodile02.jpg', 'Crocodile03.jpg', 'Crocodile04.jpg', 'Crocodile05.jpg',
      'Crocodile06.jpg', 'Crocodile07.jpg', 'Crocodile08.jpg', 'Crocodile09.jpg', 'Crocodile10.jpg',
      'Elephant01.jpg', 'Elephant02.jpg', 'Elephant03.jpg', 'Elephant04.jpg', 'Elephant05.jpg',
      'Elephant06.jpg', 'Elephant07.jpg', 'Elephant08.jpg', 'Elephant09.jpg', 'Elephant10.jpg',
      'Fox01.jpg', 'Fox02.jpg', 'Fox03.jpg', 'Fox04.jpg', 'Fox05.jpg',
      'Fox06.jpg', 'Fox07.jpg', 'Fox08.jpg', 'Fox09.jpg', 'Fox10.jpg',
      'Giraffe01.jpg', 'Giraffe02.jpg', 'Giraffe03.jpg', 'Giraffe04.jpg', 'Giraffe05.jpg',
      'Giraffe06.jpg', 'Giraffe07.jpg', 'Giraffe08.jpg', 'Giraffe09.jpg', 'Giraffe10.jpg',
      'Koala01.jpg', 'Koala02.jpg', 'Koala03.jpg', 'Koala04.jpg', 'Koala05.jpg',
      'Koala06.jpg', 'Koala07.jpg', 'Koala08.jpg', 'Koala09.jpg', 'Koala10.jpg',
      'Lion01.jpg', 'Lion02.jpg', 'Lion03.jpg', 'Lion04.jpg', 'Lion05.jpg',
      'Lion06.jpg', 'Lion07.jpg', 'Lion08.jpg', 'Lion09.jpg', 'Lion10.jpg',
      'Panda01.jpg', 'Panda02.jpg', 'Panda03.jpg', 'Panda04.jpg', 'Panda05.jpg',
      'Panda06.jpg', 'Panda07.jpg', 'Panda08.jpg', 'Panda09.jpg', 'Panda10.jpg',
      'Rhinoceros01.jpg', 'Rhinoceros02.jpg', 'Rhinoceros03.jpg', 'Rhinoceros04.jpg', 'Rhinoceros05.jpg',
      'Rhinoceros06.jpg', 'Rhinoceros07.jpg', 'Rhinoceros08.jpg', 'Rhinoceros09.jpg', 'Rhinoceros10.jpg',
      'Shark01.jpg', 'Shark02.jpg', 'Shark03.jpg', 'Shark04.jpg', 'Shark05.jpg',
      'Shark06.jpg', 'Shark07.jpg', 'Shark08.jpg', 'Shark09.jpg', 'Shark10.jpg',
      'Tiger01.jpg', 'Tiger02.jpg', 'Tiger03.jpg', 'Tiger04.jpg', 'Tiger05.jpg',
      'Tiger06.jpg', 'Tiger07.jpg', 'Tiger08.jpg', 'Tiger09.jpg', 'Tiger10.jpg',
      'Wolf01.jpg', 'Wolf02.jpg', 'Wolf03.jpg', 'Wolf04.jpg', 'Wolf05.jpg',
      'Wolf06.jpg', 'Wolf07.jpg', 'Wolf08.jpg', 'Wolf09.jpg', 'Wolf10.jpg',
      'Zebra01.jpg', 'Zebra02.jpg', 'Zebra03.jpg', 'Zebra04.jpg', 'Zebra05.jpg',
      'Zebra06.jpg', 'Zebra07.jpg', 'Zebra08.jpg', 'Zebra09.jpg', 'Zebra10.jpg'
    ],
    // For other folders, we'll populate with generic filenames and let the system handle missing images gracefully
    foods: generateGenericFilenames('Food', 20),
    celebrities: generateGenericFilenames('Celebrity', 20),
    brands: generateGenericFilenames('Brand', 20),
    movies: generateGenericFilenames('Movie', 20),
    countries: generateGenericFilenames('Country', 20),
    cities: generateGenericFilenames('City', 20),
    landmarks: generateGenericFilenames('Landmark', 20),
    objects: generateGenericFilenames('Object', 20),
    superheroes: generateGenericFilenames('Superhero', 20),
    vehicles: generateGenericFilenames('Vehicle', 20)
  };
};

// Generate generic filenames for categories where we don't have the exact inventory
const generateGenericFilenames = (prefix, count) => {
  const filenames = [];
  for (let i = 1; i <= count; i++) {
    filenames.push(`${prefix}${i.toString().padStart(2, '0')}.jpg`);
  }
  return filenames;
};

// Main function to get images based on search term
export const getImagesForSearch = async (searchTerm) => {
  if (!searchTerm) return [];
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Try to find a matching folder
  const folderName = SEARCH_TO_FOLDER_MAP[normalizedSearch];
  
  if (folderName) {
    const images = await getImagesFromFolder(folderName);
    if (images.length > 0) {
      return images;
    }
  }
  
  // If no specific folder match, try to find partial matches
  for (const [searchKey, folder] of Object.entries(SEARCH_TO_FOLDER_MAP)) {
    if (normalizedSearch.includes(searchKey) || searchKey.includes(normalizedSearch)) {
      const images = await getImagesFromFolder(folder);
      if (images.length > 0) {
        return images;
      }
    }
  }
  
  // Fallback to a default category or mixed results
  return await getDefaultImages();
};

// Fallback function for when no specific category matches
const getDefaultImages = async () => {
  // Return a mix of images from different categories
  const categories = ['sports', 'animals', 'foods', 'celebrities'];
  const mixedImages = [];
  
  for (const category of categories) {
    const categoryImages = await getImagesFromFolder(category);
    mixedImages.push(...categoryImages.slice(0, 5)); // Take first 5 from each category
  }
  
  // Shuffle the mixed results for better distribution
  return shuffleArray(mixedImages);
};

// Function to check if an image exists (for error handling)
export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Export shuffle function for external use
export const shuffleImages = shuffleArray;