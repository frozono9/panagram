export type Category = {
	question: string; // must be two options (X or Y?) to correspond with left or right column.
	setA: string[];
	setB: string[];
	searchTerms: string[];
};

export const googleImageSearchString = "https://www.google.com/search?tbm=isch&q=";

// Magic trick data structure with progressive anagrams
export const MAGIC_CATEGORIES: Record<string, Category> = {
	landmarks: {
		question: 'Man-made or natural?',
		setA: ['EiffelTower', 'Stonehenge', 'Colosseum', 'TajMahal', 'Pyramids', 'Petra'],
		setB: ['GrandCanyon', 'Everest', 'VictoriaFalls', 'GreatBarrierReef', 'Aurora', 'Sahara'],
		searchTerms: ['landmark', 'famous', 'tourist', 'place', 'travel']
	},
	animals: {
		question: 'Carnivore or herbivore?',
		setA: ['Lion', 'Tiger', 'Wolf', 'Crocodile', 'Shark', 'Fox'],
		setB: ['Elephant', 'Giraffe', 'Zebra', 'Panda', 'Rhinoceros', 'Koala'],
		searchTerms: ['animal', 'wildlife', 'creature', 'nature', 'fauna']
	},
	foods: {
		question: 'Sweet or savory?',
		setA: ['Chocolate', 'Cake', 'IceCream', 'Candy', 'Donut', 'Honey'],
		setB: ['Pizza', 'Burger', 'Pasta', 'Cheese', 'Taco', 'Sushi'],
		searchTerms: ['food', 'cuisine', 'dish', 'meal', 'snack']
	},
	celebrities: {
		question: 'Man or woman?',
		setA: [
			'LeonardoDiCaprio',
			'BradPitt',
			'MichaelJackson',
			'MrBeast',
			'ChrisHemsworth',
			'KeanuReeves'
		],
		setB: ['Beyonce', 'TaylorSwift', 'AngelinaJolie', 'ScarlettJohansson', 'Rihanna', 'Adele'],
		searchTerms: ['celebrity', 'famous', 'star', 'actor', 'singer']
	},
	brands: {
		question: 'Tech or non-tech?',
		setA: ['Apple', 'Microsoft', 'Google', 'Samsung', 'Tesla', 'Intel'],
		setB: ['Nike', 'CocaCola', 'Gucci', 'Lego', 'Chanel', 'Starbucks'],
		searchTerms: ['brand', 'company', 'logo', 'product', 'business']
	},
	movies: {
		question: 'Animated or live-action?',
		setA: ['ToyStory', 'Frozen', 'Coco', 'Moana', 'Cars', 'Zootopia'],
		setB: ['Inception', 'Gladiator', 'Titanic', 'Avatar', 'Joker', 'Interstellar'],
		searchTerms: ['movie', 'film', 'cinema', 'hollywood', 'blockbuster']
	},
	countries: {
		question: 'Europe or outside?',
		setA: ['France', 'Italy', 'Spain', 'Germany', 'Greece', 'Norway'],
		setB: ['Brazil', 'Japan', 'Canada', 'Australia', 'Egypt', 'Mexico'],
		searchTerms: ['country', 'nation', 'place', 'travel', 'world']
	},
	cities: {
		question: 'Europe or outside?',
		setA: ['Paris', 'London', 'Rome', 'Berlin', 'Madrid', 'Vienna'],
		setB: ['Tokyo', 'NewYork', 'Sydney', 'Cairo', 'Rio', 'Bangkok'],
		searchTerms: ['city', 'urban', 'metropolis', 'town', 'travel', "place"]
	},
	superheroes: {
		question: 'Marvel or DC?',
		setA: ['IronMan', 'SpiderMan', 'Thor Superhero', 'BlackPanther', 'Hulk', 'DoctorStrange'],
		setB: ['Batman', 'Superman', 'WonderWoman', 'Flash', 'Aquaman', 'GreenLantern'],
		searchTerms: ['superhero', 'comic', 'hero', 'villain', 'marvel', 'dc']
	},
	objects: {
		question: 'Man-made or natural?',
		setA: ['Chair', 'Table', 'Car', 'Phone', 'Pen', 'Laptop'],
		setB: ['Rock', 'Tree', 'Cactus', 'Cloud', 'Shell', 'Sand'],
		searchTerms: ['object', 'item', 'thing', 'stuff', 'artifact']
	},
	sports: {
		question: 'Team or individual?',
		setA: ['Football', 'Basketball', 'Baseball', 'Volleyball', 'Hockey', 'Rugby'],
		setB: ['Tennis', 'Golf', 'Boxing', 'Swimming', 'Gymnastics', 'Chess'],
		searchTerms: ['sport', 'game', 'athlete', 'competition', 'exercise']
	},
	vehicles: {
		question: 'Land or air?',
		setA: ['Car', 'Motorcycle', 'Bus', 'Truck', 'Train', 'Bicycle'],
		setB: ['Helicopter', 'Airplane', 'Glider', 'Spaceship', 'Drone', 'Zeppelin'],
		searchTerms: ['vehicle', 'transport', 'car', 'plane', 'travel']
	}
}

export const FORCE_ITEMS = [
	"7 of Hearts",
	"Queen of Hearts",
	"Ace of Spades",
	"37",
	"68",
	"Elephant",
	"Denmark",
	"House Doodle",
	"Tree Doodle"
] as const;

export type ForceItem = typeof FORCE_ITEMS[number];

export function findCategoryBySearchTerm(query: string): Category | null {
	const q = query.toLowerCase();

	const match = Object.entries(MAGIC_CATEGORIES).find(([key, category]) => {
		const haystacks = [
			key,
			category.question,
			...category.setA,
			...category.setB,
			...category.searchTerms
		];
		return haystacks.some(s => s.toLowerCase().includes(q));
	});

	return match ? match[1] : null;
}

export function getCategoryByKeyInsensitive(key: string): Category | null {
	const k = key.trim().toLowerCase();
	// Keys in MAGIC_CATEGORIES are lowercase in your data
	return (MAGIC_CATEGORIES as Record<string, Category>)[k] ?? null;
}