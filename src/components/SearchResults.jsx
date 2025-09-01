import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMagicMode } from '../hooks/useMagicMode'
import { MAGIC_CATEGORIES, generateImageVariants } from '../data/magicData'
import { createMagicScrollHandler } from '../utils/touchHandler'
import { getImagesForSearch } from '../utils/imageUtils'
import './SearchResults.css'

function SearchResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [loadedImages, setLoadedImages] = useState([])
  const [originalImages, setOriginalImages] = useState([]) // Store original images for magic mode
  const [imagesLoading, setImagesLoading] = useState(false)
  const gridRef = useRef(null)
  
  const {
    isMagicMode,
    toggleMagicMode,
    initializeCategory,
    getCurrentQuestion,
    processScrollAnswer,
    reset,
    isComplete,
    getFinalAnswer,
    currentCategory,
    remainingWords,
    currentQuestionIndex
  } = useMagicMode()

  // Mock data for famous actors images (fallback)
  const mockImages = [
    {
      id: 1,
      url: 'https://via.placeholder.com/400x300/1a73e8/ffffff?text=Leonardo+DiCaprio',
      title: 'The 10 most famous actors - The Mercury News',
      width: 400,
      height: 300
    },
    {
      id: 2,
      url: 'https://via.placeholder.com/400x500/e53935/ffffff?text=Famous+Actors+Grid',
      title: '150 Famous Male Actors - List Challenges',
      width: 400,
      height: 500
    },
    {
      id: 3,
      url: 'https://via.placeholder.com/400x350/43a047/ffffff?text=60+Greatest+Actors',
      title: 'The 60 greatest film actors of... - The Independent',
      width: 400,
      height: 350
    },
    {
      id: 4,
      url: 'https://via.placeholder.com/400x280/ff9800/ffffff?text=Black+Actors',
      title: '25 Famous Black Actors Of All... - Pinkvilla',
      width: 400,
      height: 280
    },
    {
      id: 5,
      url: 'https://via.placeholder.com/400x320/9c27b0/ffffff?text=Dwayne+Johnson',
      title: 'Dwayne Johnson - IMDb',
      width: 400,
      height: 320
    },
    {
      id: 6,
      url: 'https://via.placeholder.com/400x380/2196f3/ffffff?text=Morgan+Freeman',
      title: 'Morgan Freeman - Biography',
      width: 400,
      height: 380
    },
    {
      id: 7,
      url: 'https://via.placeholder.com/400x290/4caf50/ffffff?text=Will+Smith',
      title: 'Will Smith - Hollywood Reporter',
      width: 400,
      height: 290
    },
    {
      id: 8,
      url: 'https://via.placeholder.com/400x420/ff5722/ffffff?text=Tom+Cruise',
      title: 'Tom Cruise Movies List',
      width: 400,
      height: 420
    }
  ]

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q')
    
    // Only reload images if the search query actually changed
    if (query && query !== searchTerm) {
      setSearchTerm(query)
      
      // Load images based on search term
      const loadImages = async () => {
        setImagesLoading(true)
        try {
          const images = await getImagesForSearch(query)
          setLoadedImages(images)
          // Always update original images when doing a new search
          setOriginalImages(images)
        } catch (error) {
          console.error('Error loading images:', error)
          setLoadedImages([]) // Fallback to empty array
          setOriginalImages([])
        } finally {
          setImagesLoading(false)
        }
      }
      
      loadImages()
    } else if (query) {
      // If same query, just set the search term without reloading images
      setSearchTerm(query)
    }
    
    // Initialize magic mode if search term matches a category
    if (isMagicMode && query) {
      const normalizedQuery = query.toLowerCase().trim()
      if (MAGIC_CATEGORIES[normalizedQuery]) {
        initializeCategory(normalizedQuery)
      }
    }
  }, [location.search, searchTerm]) // Removed isMagicMode from dependencies to prevent image reloading

  // Separate effect to handle magic mode initialization without affecting images
  useEffect(() => {
    if (isMagicMode && searchTerm) {
      const normalizedQuery = searchTerm.toLowerCase().trim()
      if (MAGIC_CATEGORIES[normalizedQuery]) {
        initializeCategory(normalizedQuery)
      }
    }
  }, [isMagicMode, searchTerm, initializeCategory])

  // Generate images based on magic mode or loaded images
  const getImages = () => {
    // Always use the same images - either originalImages (if set) or loadedImages
    // This ensures images never change positions when entering/exiting magic mode
    const imagesToUse = originalImages.length > 0 ? originalImages : 
                       loadedImages.length > 0 ? loadedImages : 
                       mockImages;
    
    return imagesToUse;
  }

  // Get the appropriate title for each image based on magic mode state
  const getImageTitle = (image, columnIndex, imageIndex) => {
    if (!isMagicMode) {
      return image.title
    }

    // Only show questions in the LEFT column, keep normal titles in right column
    if (columnIndex === 1) {
      return image.title // Right column always shows normal titles
    }

    // Left column shows the magic questions throughout the column
    if (isComplete()) {
      // When complete, show the final answer only in the first image
      if (imageIndex === 0) {
        const finalAnswer = getFinalAnswer()
        if (Array.isArray(finalAnswer)) {
          return `${finalAnswer[0]} - Search Results` // Show the first word as if it was searched
        } else {
          return `${finalAnswer} - Search Results` // Show the word as if it was searched
        }
      }
      // All other images show their normal titles
      return image.title
    }

    // Show the current question from magicData.js in left column
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion) {
      if (currentQuestion.type === 'category' && imageIndex === 0) {
        // Create a realistic title with the magic question based on search category
        const searchCategory = searchTerm.toLowerCase();
        let categoryTitle = 'General Knowledge Encyclopedia';
        
        if (searchCategory.includes('sport') || searchCategory.includes('game')) {
          categoryTitle = 'Sports Psychology and Competition Analysis';
        } else if (searchCategory.includes('animal') || searchCategory.includes('wildlife')) {
          categoryTitle = 'Wildlife Biology and Animal Behavior';
        } else if (searchCategory.includes('countr') || searchCategory.includes('nation')) {
          categoryTitle = 'World Geography and Cultural Studies';
        } else if (searchCategory.includes('cit') || searchCategory.includes('town')) {
          categoryTitle = 'Urban Planning and City Architecture';
        } else if (searchCategory.includes('food') || searchCategory.includes('recipe')) {
          categoryTitle = 'Culinary Arts and Nutrition Science';
        } else if (searchCategory.includes('celebrit') || searchCategory.includes('actor')) {
          categoryTitle = 'Entertainment Industry and Celebrity Culture';
        } else if (searchCategory.includes('brand') || searchCategory.includes('company')) {
          categoryTitle = 'Business Strategy and Brand Analysis';
        } else if (searchCategory.includes('movie') || searchCategory.includes('film')) {
          categoryTitle = 'Cinema Studies and Film Analysis';
        } else if (searchCategory.includes('superhero')) {
          categoryTitle = 'Comic Book Culture and Superhero Studies';
        } else if (searchCategory.includes('object')) {
          categoryTitle = 'Design Theory and Object Classification';
        } else if (searchCategory.includes('landmark')) {
          categoryTitle = 'Architecture History and Monument Studies';
        } else if (searchCategory.includes('vehicle')) {
          categoryTitle = 'Transportation Technology and Vehicle Design';
        }
        
        return `${categoryTitle} - ${currentQuestion.question}`;
      } else if (currentQuestion.type === 'letter') {
        // For letter questions, show different realistic titles but all with the SAME letter
        const letter = currentQuestion.letter.toUpperCase();
        
        // Get category-specific realistic titles with the same letter
        const getTitlesForLetter = (category, letter) => {
          const titleTemplates = {
            sports: [
              `Best Hockey Arenas in North America - Arena *${letter}*uide`,
              `Professional Boxin*${letter.toLowerCase()}* Rankings - Combat Sports`,
              `Olympic *${letter}*thletics Guide - International Competition`,
              `Sports *${letter}*rena Architecture - Stadium Design`,
              `*${letter}*quatic Sports Training - Swimming Techniques`,
              `Basketball *${letter}*quipment Reviews - Sports Gear`
            ],
            animals: [
              `Lion Safari *${letter}*dventure - African Wildlife Experience`,
              `Tiger Conservation Biolo*${letter.toLowerCase()}*y - Wildlife Protection`,
              `*${letter}*frican Elephant Guide - Savanna Giants`,
              `*${letter}*quatic Animals Guide - Marine Life`,
              `*${letter}*rctic Wildlife Guide - Polar Animals`
            ],
            countries: [
              `France *${letter}*rchitecture Guide - European Travel`,
              `*${letter}*sian Cultural Heritage - Eastern Traditions`,
              `*${letter}*frican Safari Adventures - Wildlife Tourism`,
              `South *${letter}*merica Travel Guide - Latin Culture`
            ],
            foods: [
              `Pizza M*${letter.toLowerCase()}*king Techniques - Italian Cuisine Guide`,
              `*${letter}*rtisan Bread Baking - Culinary Methods`,
              `Chocol*${letter.toLowerCase()}*te Quality Testing - Confectionery Science`,
              `*${letter}*sia Food Culture - International Cuisine`
            ]
          };
          
          const category_key = category || 'sports';
          return titleTemplates[category_key] || titleTemplates.sports;
        };
        
        const searchCategory = searchTerm.toLowerCase();
        let category = 'sports';
        if (searchCategory.includes('animal')) category = 'animals';
        else if (searchCategory.includes('countr')) category = 'countries';  
        else if (searchCategory.includes('food')) category = 'foods';
        
        const titles = getTitlesForLetter(category, letter);
        const titleIndex = imageIndex % titles.length;
        return titles[titleIndex];
      }
    }

    return image.title
  }

  // Function to process title and make asterisk-wrapped letters bold and uppercase
  const processTitle = (title) => {
    if (!title) return title;
    
    // Replace *letter* with <strong>LETTER</strong> (uppercase)
    return title.replace(/\*([a-zA-Z])\*/g, (match, letter) => `<strong>${letter.toUpperCase()}</strong>`);
  };

  // Get filter chips based on search category
  const getFilterChips = () => {
    const category = searchTerm.toLowerCase();
    
    const filterMappings = {
      sports: [
        { label: 'Clipart', avatar: 'clipart' },
        { label: 'Team', avatar: 'team' },
        { label: 'Logo', avatar: 'logo' }
      ],
      animals: [
        { label: 'Wildlife', avatar: 'wildlife' },
        { label: 'Pets', avatar: 'pets' },
        { label: 'Safari', avatar: 'safari' }
      ],
      foods: [
        { label: 'Recipe', avatar: 'recipe' },
        { label: 'Restaurant', avatar: 'restaurant' },
        { label: 'Healthy', avatar: 'healthy' }
      ],
      celebrities: [
        { label: 'Photos', avatar: 'photos' },
        { label: 'Movies', avatar: 'movies' },
        { label: 'News', avatar: 'news' }
      ],
      brands: [
        { label: 'Logo', avatar: 'logo' },
        { label: 'Products', avatar: 'products' },
        { label: 'Store', avatar: 'store' }
      ],
      movies: [
        { label: 'Poster', avatar: 'poster' },
        { label: 'Scene', avatar: 'scene' },
        { label: 'Cast', avatar: 'cast' }
      ],
      countries: [
        { label: 'Flag', avatar: 'flag' },
        { label: 'Map', avatar: 'map' },
        { label: 'Culture', avatar: 'culture' }
      ],
      cities: [
        { label: 'Skyline', avatar: 'skyline' },
        { label: 'Streets', avatar: 'streets' },
        { label: 'Tourism', avatar: 'tourism' }
      ],
      superheroes: [
        { label: 'Comics', avatar: 'comics' },
        { label: 'Movies', avatar: 'movies' },
        { label: 'Costume', avatar: 'costume' }
      ],
      objects: [
        { label: 'Vector', avatar: 'vector' },
        { label: 'Photo', avatar: 'photo' },
        { label: 'Design', avatar: 'design' }
      ],
      landmarks: [
        { label: 'Photos', avatar: 'photos' },
        { label: 'History', avatar: 'history' },
        { label: 'Tourism', avatar: 'tourism' }
      ],
      vehicles: [
        { label: 'Models', avatar: 'models' },
        { label: 'Classic', avatar: 'classic' },
        { label: 'Racing', avatar: 'racing' }
      ]
    };

    // Return filters for the current category, or default filters
    return filterMappings[category] || [
      { label: 'Brown hair', avatar: 'brown-hair' },
      { label: 'Movie', avatar: 'movie' },
      { label: 'Blonde hair', avatar: 'blonde-hair' }
    ];
  };

  // Get the appropriate image URL based on magic mode state
  const getImageUrl = (image, columnIndex, imageIndex) => {
    if (!isMagicMode || columnIndex === 1) {
      return image.url // Use original URL for non-magic mode or right column
    }

    // For the first image in left column when magic trick is complete
    if (isComplete() && imageIndex === 0) {
      const finalAnswer = getFinalAnswer()
      const word = Array.isArray(finalAnswer) ? finalAnswer[0] : finalAnswer
      
      // Get the current category to build the correct image path
      const categoryKey = Object.keys(MAGIC_CATEGORIES).find(key => 
        MAGIC_CATEGORIES[key].setA.includes(word) || MAGIC_CATEGORIES[key].setB.includes(word)
      )
      
      if (categoryKey) {
        // Use the actual image from the correct folder (first variant: 01.jpg)
        return `${import.meta.env.BASE_URL}images/${categoryKey}/${word}01.jpg`
      }
      
      // Fallback to placeholder if category not found
      return `https://via.placeholder.com/400x300/4CAF50/ffffff?text=${encodeURIComponent(word)}`
    }

    return image.url // Use original URL for other cases
  };

  // Handle scroll/touch events for magic mode
  const magicHandler = createMagicScrollHandler(processScrollAnswer, isComplete)

  const handleGridTouch = (e, columnIndex) => {
    if (!isMagicMode) return
    magicHandler.handleClick(e, columnIndex)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleLogoClick = () => {
    // Redirect to real Google Images
    window.open('https://www.google.com/imghp?hl=en', '_blank')
  }

  const handleBellClick = () => {
    // Toggle magic mode with single click on bell icon
    toggleMagicMode()
  }

  const images = getImages()

  return (
    <div className="search-results">
      <div className="search-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="google-logo-small" onClick={handleLogoClick}>
              <span className="google-text-small">Google</span>
            </span>
          </div>
          
          <div className="header-icons">
            {/* Magic Mode Toggle - Click the bell icon to activate */}
            <div className="header-icon" onClick={handleBellClick} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isMagicMode ? "#8ab4f8" : "#9aa0a6"}>
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <div className="profile-icon-small">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          
          <form className="search-form-header" onSubmit={handleSearch}>
            <div className="search-container-header">
              <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9aa0a6">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <input
                type="text"
                className="search-input-header"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder=""
              />
              <div className="voice-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#9aa0a6">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
              <div className="camera-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#9aa0a6">
                  <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="search-tabs">
        <div className="tabs-container">
          <span className="search-tab">All</span>
          <span className="search-tab active">Images</span>
          <span className="search-tab">Forums</span>
          <span className="search-tab">Short videos</span>
          <span className="search-tab">Web</span>
          <span className="search-tab">Fin</span>
        </div>
      </div>

      <div className="filter-chips">
        {getFilterChips().map((chip, index) => (
          <div key={index} className="chip">
            <div className={`chip-avatar ${chip.avatar}`}></div>
            <span>{chip.label}</span>
          </div>
        ))}
      </div>

      <div className="images-grid" ref={gridRef}>
        {imagesLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading images...</div>
          </div>
        ) : (
          <>
            <div 
              className="grid-column left-column"
              onTouchStart={(e) => isMagicMode && magicHandler.handleTouchStart(e, 0)}
              onTouchMove={(e) => isMagicMode && magicHandler.handleTouchMove(e)}
              onTouchEnd={(e) => isMagicMode && magicHandler.handleTouchEnd(e, 0)}
              onClick={(e) => handleGridTouch(e, 0)}
            >
              {images.filter((_, index) => index % 2 === 0).map((image, imageIndex) => (
                <div key={image.id || image.variant} className="image-item">
                  <img 
                    src={getImageUrl(image, 0, imageIndex)} 
                    alt={getImageTitle(image, 0, imageIndex)}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.src = `https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found`;
                    }}
                  />
                  <div 
                    className="image-title"
                    dangerouslySetInnerHTML={{ __html: processTitle(getImageTitle(image, 0, imageIndex)) }}
                  ></div>
                </div>
              ))}
            </div>
            <div 
              className="grid-column right-column"
              onTouchStart={(e) => isMagicMode && magicHandler.handleTouchStart(e, 1)}
              onTouchMove={(e) => isMagicMode && magicHandler.handleTouchMove(e)}
              onTouchEnd={(e) => isMagicMode && magicHandler.handleTouchEnd(e, 1)}
              onClick={(e) => handleGridTouch(e, 1)}
            >
              {images.filter((_, index) => index % 2 === 1).map((image, imageIndex) => (
                <div key={image.id || image.variant} className="image-item">
                  <img 
                    src={getImageUrl(image, 1, imageIndex)} 
                    alt={getImageTitle(image, 1, imageIndex)}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.src = `https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found`;
                    }}
                  />
                  <div 
                    className="image-title"
                    dangerouslySetInnerHTML={{ __html: processTitle(getImageTitle(image, 1, imageIndex)) }}
                  ></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults
