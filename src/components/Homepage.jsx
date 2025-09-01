import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFilteredSuggestions, isMagicCategory } from '../data/autocompleteData'
import './Homepage.css'

function Homepage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const suggestionRefs = useRef([])

  // Get description for autocomplete suggestions
  const getDescriptionForSuggestion = (suggestion) => {
    const descriptions = {
      // Sports
      'Football': 'Sport',
      'Basketball': 'Sport',
      'Baseball': 'Sport', 
      'Tennis': 'Sport',
      'Golf': 'Sport',
      'Swimming': 'Sport',
      'Boxing': 'Sport',
      'Chess': 'Sport',
      'Hockey': 'Sport',
      'Rugby': 'Sport',
      'Gymnastics': 'Sport',
      'Volleyball': 'Sport',
      
      // Countries
      'France': 'Country',
      'Spain': 'Country', 
      'Brazil': 'Country',
      'Italy': 'Country',
      'Germany': 'Country',
      'Japan': 'Country',
      'Australia': 'Country',
      'Canada': 'Country',
      'Mexico': 'Country',
      'Egypt': 'Country',
      'Greece': 'Country',
      'Norway': 'Country',
      
      // Cities
      'Paris': 'City in France',
      'London': 'City in United Kingdom',
      'Berlin': 'City in Germany',
      'Madrid': 'City in Spain',
      'Rome': 'City in Italy',
      'Tokyo': 'City in Japan',
      'New York': 'City in United States',
      'Sydney': 'City in Australia',
      'Cairo': 'City in Egypt',
      'Bangkok': 'City in Thailand',
      'Vienna': 'City in Austria',
      'Las Vegas': 'City in United States',
      
      // People/Celebrities
      'Leonardo DiCaprio': 'Actor',
      'Michael Jackson': 'Singer',
      'Taylor Swift': 'Singer',
      'Beyoncé': 'Singer',
      'Brad Pitt': 'Actor',
      'Celine Dion': 'Canadian singer',
      'Adele': 'Singer',
      'Rihanna': 'Singer',
      'Keanu Reeves': 'Actor',
      'Chris Hemsworth': 'Actor',
      
      // Brands/Companies
      'Apple': 'Technology company',
      'Nike': 'Sportswear brand',
      'Google': 'Technology company',
      'Microsoft': 'Technology company',
      'Tesla': 'Electric vehicle company',
      'Samsung': 'Technology company',
      'Coca Cola': 'Beverage brand',
      'Starbucks': 'Coffee chain',
      'Intel': 'Technology company',
      
      // Movies
      'Inception': 'Movie',
      'Avatar': 'Movie',
      'Titanic': 'Movie',
      'Gladiator': 'Movie',
      'Joker': 'Movie',
      'Interstellar': 'Movie',
      'Toy Story': 'Animated movie',
      'Frozen': 'Animated movie',
      'Moana': 'Animated movie',
      
      // Superheroes
      'Superman': 'DC superhero',
      'Batman': 'DC superhero',
      'Spider-Man': 'Marvel superhero',
      'Iron Man': 'Marvel superhero',
      'Wonder Woman': 'DC superhero',
      'Thor': 'Marvel superhero',
      'Flash': 'DC superhero',
      'Hulk': 'Marvel superhero',
      
      // Landmarks
      'Eiffel Tower': 'Landmark in Paris',
      'Great Wall': 'Landmark in China',
      'Pyramids': 'Ancient landmark in Egypt',
      'Taj Mahal': 'Landmark in India',
      'Colosseum': 'Landmark in Rome',
      'Petra': 'Ancient city in Jordan',
      'Grand Canyon': 'Natural landmark in USA',
      'Victoria Falls': 'Waterfall in Africa',
      
      // Animals
      'Lion': 'Wild animal',
      'Tiger': 'Wild animal',
      'Elephant': 'Wild animal',
      'Panda': 'Endangered species',
      'Wolf': 'Wild animal',
      'Eagle': 'Bird of prey',
      
      // Foods
      'Pizza': 'Italian dish',
      'Sushi': 'Japanese dish',
      'Chocolate': 'Sweet confection',
      'Coffee': 'Beverage',
      'Pasta': 'Italian dish',
      'Burger': 'Fast food',
      'Taco': 'Mexican dish',
      
      // Vehicles
      'Tesla Model S': 'Electric car',
      'BMW': 'Car manufacturer',
      'Motorcycle': 'Vehicle',
      'Helicopter': 'Aircraft',
      'Airplane': 'Aircraft',
      
      // General categories - these should look normal, no special descriptions
      'Art': 'Creative works',
      'Architecture': 'Building design',
      'Music': 'Audio entertainment',
      'Photography': 'Visual art',
      'Technology': 'Digital innovation',
      'Nature': 'Natural world',
      'Fashion': 'Clothing and style',
      'Travel': 'Tourism and exploration'
    };
    
    return descriptions[suggestion] || null;
  }

  // Update suggestions when search term changes
  useEffect(() => {
    const newSuggestions = getFilteredSuggestions(searchTerm)
    setSuggestions(newSuggestions)
    setSelectedSuggestionIndex(-1)
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    const termToSearch = searchTerm.trim()
    if (termToSearch) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(termToSearch)}`)
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
    const newSuggestions = getFilteredSuggestions(searchTerm)
    setSuggestions(newSuggestions)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  return (
    <div className="homepage">
      <div className="homepage-header">
        <div className="header-left">
          <span className="tab active">ALL</span>
          <span className="tab">IMAGES</span>
        </div>
        <div className="header-right">
          <div className="header-icon notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9aa0a6">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>
          <div className="header-icon apps">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9aa0a6">
              <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"/>
            </svg>
          </div>
          <div className="profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="homepage-content">
        <div className="google-logo">
          <div className="google-text">
            Google
            <span className="images-text">images</span>
          </div>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9aa0a6">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder=""
              autoComplete="off"
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
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion}-${index}`}
                  ref={el => suggestionRefs.current[index] = el}
                  className={`autocomplete-suggestion ${
                    index === selectedSuggestionIndex ? 'selected' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#9aa0a6">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-text">{suggestion}</div>
                    {getDescriptionForSuggestion(suggestion) && (
                      <div className="suggestion-description">{getDescriptionForSuggestion(suggestion)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      
      <div className="homepage-footer">
        <div className="location">Spain</div>
        <div className="footer-links">
          <span>Dark theme: on</span>
          <span>Settings</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  )
}

export default Homepage
