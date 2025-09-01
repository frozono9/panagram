import { useState, useEffect } from 'react'
import './ImageViewer.css'

function ImageViewer({ isOpen, onClose, word, images = [], category = 'animals' }) {
  const [isLoading, setIsLoading] = useState(true)

  // Reset loading when viewer opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = (e) => {
    setIsLoading(false)
    // Fallback to placeholder if image fails to load
    e.target.src = `https://via.placeholder.com/800x600/f0f0f0/666666?text=${encodeURIComponent(word || 'Image')}`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentImage?.title || word,
        url: window.location.href
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleSave = () => {
    // Create a temporary link to download the image
    if (currentImage?.url) {
      const link = document.createElement('a')
      link.href = currentImage.url
      link.download = `${word || 'image'}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[0] // Only show the first (and only) image

  // Generate related images that start with the same word name from the correct category folder
  const generateRelatedImages = (wordName, categoryFolder) => {
    console.log('generateRelatedImages called with:', { wordName, categoryFolder })
    if (!wordName) return []
    
    // Capitalize first letter to match file naming convention
    const capitalizedWord = wordName.charAt(0).toUpperCase() + wordName.slice(1).toLowerCase()
    console.log('capitalizedWord:', capitalizedWord)
    
    // Generate 4 related images with the naming pattern: Word01.jpg, Word02.jpg, etc.
    const relatedImages = []
    for (let i = 1; i <= 4; i++) {
      const paddedNumber = i.toString().padStart(2, '0')
      const filename = `${capitalizedWord}${paddedNumber}.jpg`
      const imageUrl = `/images/${categoryFolder}/${filename}`
      relatedImages.push({
        id: `related${i}`,
        url: imageUrl,
        title: `${capitalizedWord} ${i}`,
        filename: filename
      })
      console.log(`Generated related image ${i}:`, imageUrl)
    }
    
    console.log('Final relatedImages:', relatedImages)
    return relatedImages
  }

  const relatedImages = generateRelatedImages(word, category)

  return (
    <div className="image-viewer-overlay">
      {/* Header */}
      <div className="image-viewer-header">
        <div className="image-viewer-source">
          <div className="source-icon">W</div>
          <div className="source-info">
            <div className="source-name">Wikipedia</div>
            <div className="source-description">The Free Encyclopedia</div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="header-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          <button className="image-viewer-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="image-viewer-main">
        {/* Image section */}
        <div className="image-viewer-content">
          {isLoading && (
            <div className="image-viewer-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img
            src={currentImage?.url}
            alt={currentImage?.title || word}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="image-viewer-image"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>

        {/* Image info and actions */}
        <div className="image-viewer-info">
          <h1 className="image-viewer-title">
            Archive:{word || 'Image'}.svg - Wikipedia, The Free Encyclopedia
          </h1>
          <p className="image-viewer-description">
            Images may be subject to copyright. <strong>Learn More</strong>
          </p>
          
          <div className="image-viewer-actions">
            <button className="action-btn" onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>
            <button className="action-btn" onClick={handleSave}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* Related images */}
        <div className="related-images">
          <h3>Related images</h3>
          <div className="related-grid">
            {relatedImages.map((img) => (
              <div key={img.id} className="related-item">
                <img
                  src={img.url}
                  alt={img.title}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x200/cccccc/666666?text=Related`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageViewer
