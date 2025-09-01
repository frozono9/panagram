// Enhanced touch and scroll detection for magic mode
export const createMagicScrollHandler = (processAnswer, isComplete) => {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isScrolling = false;
  let hasMoved = false;

  const handleTouchStart = (e, columnIndex) => {
    if (isComplete()) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    isScrolling = false;
    hasMoved = false;
  };

  const handleTouchMove = (e) => {
    if (isComplete()) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    hasMoved = true;
    
    // If they're scrolling vertically more than horizontally, consider it a scroll
    if (deltaY > deltaX && deltaY > 20) {
      isScrolling = true;
    }
  };

  const handleTouchEnd = (e, columnIndex) => {
    if (isComplete()) return;
    
    const touchDuration = Date.now() - touchStartTime;
    
    // If it was a quick tap (less than 300ms) and they didn't scroll much, treat as a click
    // If they scrolled significantly, treat as a scroll gesture
    if ((isScrolling && touchDuration < 1000) || (!hasMoved && touchDuration < 300)) {
      e.preventDefault();
      processAnswer(columnIndex === 0);
    }
    
    isScrolling = false;
    hasMoved = false;
  };

  const handleClick = (e, columnIndex) => {
    if (isComplete()) return;
    
    e.preventDefault();
    processAnswer(columnIndex === 0);
  };

  return {
    handleTouchStart,
    handleTouchMove, 
    handleTouchEnd,
    handleClick
  };
};
