export type Category = {
	question: string;
	optionA: string;
	optionB: string;
	setA: string[];
	setB: string[];
	searchTerms: string[];
};

// Magic trick data structure with progressive anagrams
export const MAGIC_CATEGORIES: Record<string, Category> = {
	landmarks: {
		question: 'Man-made or natural?',
		optionA: 'Man-made',
		optionB: 'Natural',
		setA: ['EiffelTower', 'Stonehenge', 'Colosseum', 'TajMahal', 'Pyramids', 'Petra'],
		setB: ['GrandCanyon', 'Everest', 'VictoriaFalls', 'GreatBarrierReef', 'Aurora', 'Sahara'],
		searchTerms: ['landmark', 'famous', 'tourist', 'place', 'travel']
	},
	animals: {
		question: 'Carnivore or herbivore?',
		optionA: 'Carnivore',
		optionB: 'Herbivore',
		setA: ['Lion', 'Tiger', 'Wolf', 'Crocodile', 'Shark', 'Fox'],
		setB: ['Elephant', 'Giraffe', 'Zebra', 'Panda', 'Rhinoceros', 'Koala'],
		searchTerms: ['animal', 'wildlife', 'creature', 'nature', 'fauna']
	},
	foods: {
		question: 'Sweet or savory?',
		optionA: 'Sweet',
		optionB: 'Savory',
		setA: ['Chocolate', 'Cake', 'IceCream', 'Candy', 'Donut', 'Honey'],
		setB: ['Pizza', 'Burger', 'Pasta', 'Cheese', 'Taco', 'Sushi'],
		searchTerms: ['food', 'cuisine', 'dish', 'meal', 'snack']
	},
	celebrities: {
		question: 'Man or woman?',
		optionA: 'Man',
		optionB: 'Woman',
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
		optionA: 'Tech',
		optionB: 'Non-tech',
		setA: ['Apple', 'Microsoft', 'Google', 'Samsung', 'Tesla', 'Intel'],
		setB: ['Nike', 'CocaCola', 'Gucci', 'Lego', 'Chanel', 'Starbucks'],
		searchTerms: ['brand', 'company', 'logo', 'product', 'business']
	},
	movies: {
		question: 'Animated or live-action?',
		optionA: 'Animated',
		optionB: 'Live-action',
		setA: ['ToyStory', 'Frozen Movie', 'Coco Pixar', 'Moana Movie', 'Cars Movie', 'Zootopia Movie'],
		setB: ['Inception', 'Gladiator', 'Titanic', 'Avatar', 'Joker', 'Interstellar'],
		searchTerms: ['movie', 'film', 'cinema', 'hollywood', 'blockbuster']
	},
	countries: {
		question: 'Europe or outside?',
		optionA: 'Europe',
		optionB: 'Outside Europe',
		setA: ['France', 'Italy', 'Spain', 'Germany', 'Greece', 'Norway'],
		setB: ['Brazil', 'Japan', 'Canada', 'Australia', 'Egypt', 'Mexico'],
		searchTerms: ['country', 'nation', 'place', 'travel', 'world']
	},
	cities: {
		question: 'Europe or outside?',
		optionA: 'Europe',
		optionB: 'Outside Europe',
		setA: ['Paris', 'London', 'Rome', 'Berlin', 'Madrid', 'Vienna'],
		setB: ['Tokyo', 'NewYork', 'Sydney', 'Cairo', 'Rio', 'Bangkok'],
		searchTerms: ['city', 'urban', 'metropolis', 'town', 'travel']
	},
	superheroes: {
		question: 'Marvel or DC?',
		optionA: 'Marvel',
		optionB: 'DC',
		setA: ['IronMan', 'SpiderMan', 'Thor Superhero', 'BlackPanther', 'Hulk', 'DoctorStrange'],
		setB: ['Batman', 'Superman', 'WonderWoman', 'Flash', 'Aquaman', 'GreenLantern'],
		searchTerms: ['superhero', 'comic', 'hero', 'villain', 'marvel', 'dc']
	},
	objects: {
		question: 'Man-made or natural?',
		optionA: 'Man-made',
		optionB: 'Natural',
		setA: ['Chair', 'Table', 'Car', 'Phone', 'Pen', 'Laptop'],
		setB: ['Rock', 'Tree', 'Cactus', 'Cloud', 'Shell', 'Sand'],
		searchTerms: ['object', 'item', 'thing', 'stuff', 'artifact']
	},
	sports: {
		question: 'Team or individual?',
		optionA: 'Team',
		optionB: 'Individual',
		setA: ['Football', 'Basketball', 'Baseball', 'Volleyball', 'Hockey', 'Rugby'],
		setB: ['Tennis', 'Golf', 'Boxing', 'Swimming', 'Gymnastics', 'Chess'],
		searchTerms: ['sport', 'game', 'athlete', 'competition', 'exercise']
	},
	vehicles: {
		question: 'Land or air?',
		optionA: 'Land',
		optionB: 'Air',
		setA: ['Car', 'Motorcycle', 'Bus', 'Truck', 'Train', 'Bicycle'],
		setB: ['Helicopter', 'Airplane', 'Glider', 'Spaceship', 'Drone', 'Zeppelin'],
		searchTerms: ['vehicle', 'transport', 'car', 'plane', 'travel']
	}
}

export const FORCE_ITEMS = [
	"7 of Hearts",
	"37",
	"Elephant"
] as const;

export type ForceItem = typeof FORCE_ITEMS[number];
