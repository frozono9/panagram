# Magic Panagram - Google Images Magic Trick

A perfect replica of Google Images that includes a completely hidden progressive anagram magic trick system.

## 🎭 Performance Instructions

### For the Spectator:
1. Go to the website (looks exactly like Google Images)
2. Search for one of the available categories: landmarks, animals, foods, celebrities, brands, movies, countries, cities, superheroes, objects, sports, or vehicles
3. Browse through the image results and mentally select one image (don't click or interact)
4. Scroll back to the top
5. Hand the phone back to the magician

### For the Magician:
1. **Secret Activation**: **Triple-tap the Google logo** to activate magic mode (completely invisible to spectator)
2. **Read the Questions**: Only the titles in the LEFT column will now show questions
3. **Navigate Through Questions**: 
   - Tap/scroll on the **LEFT column** for "Yes" or "Option A" 
   - Tap/scroll on the **RIGHT column** for "No" or "Option B"
4. **First Question**: Always a category-specific split (e.g., "Is it man-made or natural?" for landmarks)
5. **Follow-up Questions**: Progressive letter-based questions (e.g., "Is there a letter 'S' in your word?")
6. **Final Reveal**: The first image title in the left column will show the final answer

## 📱 Mobile Setup

To test on your phone:
1. Run `npm run dev -- --host` (server will show network IP)
2. Connect your phone to the same WiFi network
3. Open `http://[YOUR-IP]:5173` on your phone (e.g., `http://192.168.1.51:5173`)

## 🎯 Key Features for Magic Performance

- **Completely Invisible**: No visible magic mode indicators to the spectator
- **Natural Appearance**: Looks exactly like Google Images at all times  
- **Mobile Optimized**: Works perfectly on phone with touch gestures
- **Subtle Questions**: Only the left column shows questions, right column stays normal
- **Quick Activation**: Secret triple-tap activation that spectator won't notice

## Available Categories

Each category has 12 items split into two groups of 6:

### Landmarks (Man-made vs Natural)
- **Man-made**: Eiffel Tower, Great Wall, Colosseum, Taj Mahal, Pyramids, Statue of Liberty
- **Natural**: Grand Canyon, Mount Everest, Victoria Falls, Great Barrier Reef, Aurora Borealis, Sahara Desert

### Animals (Carnivore vs Herbivore) 
- **Carnivore**: Lion, Tiger, Wolf, Crocodile, Shark, Fox
- **Herbivore**: Elephant, Giraffe, Zebra, Panda, Rhinoceros, Koala

### Foods (Sweet vs Savory)
- **Sweet**: Chocolate, Cake, Ice Cream, Candy, Donut, Honey
- **Savory**: Pizza, Burger, Pasta, Cheese, Taco, Sushi

### Celebrities (Man vs Woman)
- **Man**: Leonardo DiCaprio, Brad Pitt, Michael Jackson, MrBeast, Chris Hemsworth, Keanu Reeves
- **Woman**: Beyoncé, Taylor Swift, Angelina Jolie, Scarlett Johansson, Rihanna, Adele

### Brands (Tech vs Non-tech)
- **Tech**: Apple, Microsoft, Google, Samsung, Tesla, Intel
- **Non-tech**: Nike, Coca-Cola, Gucci, Lego, Chanel, Starbucks

### Movies (Animated vs Live-action)
- **Animated**: Toy Story, Frozen, Coco, Moana, Cars, Zootopia
- **Live-action**: Inception, Gladiator, Titanic, Avatar, Joker, Interstellar

### Countries (Europe vs Outside Europe)
- **Europe**: France, Italy, Spain, Germany, Greece, Norway
- **Outside Europe**: Brazil, Japan, Canada, Australia, Egypt, Mexico

### Cities (Europe vs Outside Europe)
- **Europe**: Paris, London, Rome, Berlin, Madrid, Vienna
- **Outside Europe**: Tokyo, New York, Sydney, Cairo, Rio, Bangkok

### Superheroes (Marvel vs DC)
- **Marvel**: Iron Man, Spider-Man, Thor, Black Panther, Hulk, Doctor Strange
- **DC**: Batman, Superman, Wonder Woman, Flash, Aquaman, Green Lantern

### Objects (Man-made vs Natural)
- **Man-made**: Chair, Table, Car, Phone, Pen, Laptop
- **Natural**: Rock, Tree, Cactus, Cloud, Shell, Sand

### Sports (Team vs Individual)
- **Team**: Football, Basketball, Baseball, Volleyball, Hockey, Rugby
- **Individual**: Tennis, Golf, Boxing, Swimming, Gymnastics, Chess

### Vehicles (Land vs Air)
- **Land**: Car, Motorcycle, Bus, Truck, Train, Bicycle
- **Air**: Helicopter, Airplane, Glider, Spaceship, Drone, Zeppelin

## Technical Implementation

The system uses an entropy-based progressive anagram algorithm that:
1. Splits the initial 12 options in half based on the category question
2. Uses letter frequency analysis to find the optimal next question
3. Continues until only one option remains or no more discriminating letters exist

Each category generates 120 images (12 items × 10 variants each) for a realistic Google Images experience.

## Development

```bash
npm install
npm run dev
```

## Usage Tips for Magicians

1. **Practice the Categories**: Memorize which categories are available and their split questions
2. **Smooth Interaction**: The touch/click detection works best with confident, deliberate movements
3. **Visual Cues**: In magic mode, left column has green hover effect (Yes/Option A), right column has red hover effect (No/Option B)
4. **Backup Plan**: If the system can't narrow down to one answer, it will show the remaining possibilities
5. **Reset**: Click the Google logo to reset and start over+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
