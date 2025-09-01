// Magic trick data structure with progressive anagrams
export const MAGIC_CATEGORIES = {
  landmarks: {
    question: "Man-made or natural?",
    optionA: "Man-made",
    optionB: "Natural",
    setA: ["EiffelTower", "Stonehenge", "Colosseum", "TajMahal", "Pyramids", "Petra"],
    setB: ["GrandCanyon", "Everest", "VictoriaFalls", "GreatBarrierReef", "Aurora", "Sahara"]
  },
  animals: {
    question: "Carnivore or herbivore?", 
    optionA: "Carnivore",
    optionB: "Herbivore",
    setA: ["Lion", "Tiger", "Wolf", "Crocodile", "Shark", "Fox"],
    setB: ["Elephant", "Giraffe", "Zebra", "Panda", "Rhinoceros", "Koala"]
  },
  foods: {
    question: "Sweet or savory?",
    optionA: "Sweet", 
    optionB: "Savory",
    setA: ["Chocolate", "Cake", "IceCream", "Candy", "Donut", "Honey"],
    setB: ["Pizza", "Burger", "Pasta", "Cheese", "Taco", "Sushi"]
  },
  celebrities: {
    question: "Man or woman?",
    optionA: "Man",
    optionB: "Woman", 
    setA: ["LeonardoDiCaprio", "BradPitt", "MichaelJackson", "MrBeast", "ChrisHemsworth", "KeanuReeves"],
    setB: ["Beyonce", "TaylorSwift", "AngelinaJolie", "ScarlettJohansson", "Rihanna", "Adele"]
  },
  brands: {
    question: "Tech or non-tech?",
    optionA: "Tech",
    optionB: "Non-tech",
    setA: ["Apple", "Microsoft", "Google", "Samsung", "Tesla", "Intel"],
    setB: ["Nike", "CocaCola", "Gucci", "Lego", "Chanel", "Starbucks"]
  },
  movies: {
    question: "Animated or live-action?",
    optionA: "Animated", 
    optionB: "Live-action",
    setA: ["ToyStory", "Frozen", "Coco", "Moana", "Cars", "Zootopia"],
    setB: ["Inception", "Gladiator", "Titanic", "Avatar", "Joker", "Interstellar"]
  },
  countries: {
    question: "Europe or outside?",
    optionA: "Europe",
    optionB: "Outside Europe",
    setA: ["France", "Italy", "Spain", "Germany", "Greece", "Norway"],
    setB: ["Brazil", "Japan", "Canada", "Australia", "Egypt", "Mexico"]
  },
  cities: {
    question: "Europe or outside?", 
    optionA: "Europe",
    optionB: "Outside Europe",
    setA: ["Paris", "London", "Rome", "Berlin", "Madrid", "Vienna"],
    setB: ["Tokyo", "NewYork", "Sydney", "Cairo", "Rio", "Bangkok"]
  },
  superheroes: {
    question: "Marvel or DC?",
    optionA: "Marvel",
    optionB: "DC", 
    setA: ["IronMan", "SpiderMan", "Thor", "BlackPanther", "Hulk", "DoctorStrange"],
    setB: ["Batman", "Superman", "WonderWoman", "Flash", "Aquaman", "GreenLantern"]
  },
  objects: {
    question: "Man-made or natural?",
    optionA: "Man-made",
    optionB: "Natural",
    setA: ["Chair", "Table", "Car", "Phone", "Pen", "Laptop"],
    setB: ["Rock", "Tree", "Cactus", "Cloud", "Shell", "Sand"]
  },
  sports: {
    question: "Team or individual?",
    optionA: "Team",
    optionB: "Individual", 
    setA: ["Football", "Basketball", "Baseball", "Volleyball", "Hockey", "Rugby"],
    setB: ["Tennis", "Golf", "Boxing", "Swimming", "Gymnastics", "Chess"]
  },
  vehicles: {
    question: "Land or air?",
    optionA: "Land",
    optionB: "Air",
    setA: ["Car", "Motorcycle", "Bus", "Truck", "Train", "Bicycle"],
    setB: ["Helicopter", "Airplane", "Glider", "Spaceship", "Drone", "Zeppelin"]
  }
};

// Generate 10 variants of each word for the image grid
export const generateImageVariants = (words) => {
  const variants = [];
  words.forEach(word => {
    for (let i = 1; i <= 10; i++) {
      variants.push({
        word: word,
        variant: i,
        id: `${word}_${i}`,
        url: `https://via.placeholder.com/400x${300 + (i * 20)}/ff6b6b/ffffff?text=${encodeURIComponent(word)}+${i}`,
        title: `${word} - Image ${i}`
      });
    }
  });
  return variants;
};

// Entropy calculation for progressive anagram
function entropy(c, n) {
  if (c === 0 || c === n) return 0;
  const p = c / n;
  return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

// Find the best letter to ask about next
function bestSplitLetter(words, askedLetters) {
  const n = words.length;
  const counts = {};
  
  words.forEach(word => {
    const uniqueChars = new Set(word.toLowerCase());
    uniqueChars.forEach(char => {
      if (/[a-z]/.test(char)) {
        counts[char] = (counts[char] || 0) + 1;
      }
    });
  });

  const candidates = [];
  Object.entries(counts).forEach(([char, count]) => {
    if (count > 0 && count < n && !askedLetters.has(char)) {
      candidates.push({
        letter: char,
        count: count,
        entropy: entropy(count, n)
      });
    }
  });

  if (candidates.length === 0) return null;

  // Sort by entropy (descending), then count (descending), then alphabetically
  candidates.sort((a, b) => {
    if (b.entropy !== a.entropy) return b.entropy - a.entropy;
    if (b.count !== a.count) return b.count - a.count;
    return a.letter.localeCompare(b.letter);
  });

  return candidates[0].letter;
}

// Generate the complete question sequence for a category
export const generateQuestionSequence = (category, selectedSet) => {
  const categoryData = MAGIC_CATEGORIES[category];
  if (!categoryData) return [];

  const words = selectedSet === 'A' ? categoryData.setA : categoryData.setB;
  const questions = [];
  
  // First question - category split
  questions.push({
    type: 'category',
    question: categoryData.question,
    leftOption: categoryData.optionA,
    rightOption: categoryData.optionB
  });

  // Progressive anagram questions
  let remainingWords = [...words];
  const askedLetters = new Set();

  while (remainingWords.length > 1) {
    const letter = bestSplitLetter(remainingWords, askedLetters);
    if (!letter) break;

    askedLetters.add(letter);
    questions.push({
      type: 'letter',
      question: `Is there a letter '${letter.toUpperCase()}' in your word?`,
      letter: letter,
      leftOption: "Yes",
      rightOption: "No"
    });

    // For the magic trick, we don't actually split here - that happens during performance
  }

  // Final reveal - all remaining possibilities
  questions.push({
    type: 'reveal',
    question: 'Your word is:',
    words: remainingWords
  });

  return questions;
};

// Process a user's answer to filter words
export const processAnswer = (words, question, answer) => {
  if (question.type === 'letter') {
    const letter = question.letter;
    if (answer === 'left') { // Yes
      return words.filter(word => word.toLowerCase().includes(letter));
    } else { // No
      return words.filter(word => !word.toLowerCase().includes(letter));
    }
  }
  return words;
};
