import { useState, useCallback } from 'react';
import { MAGIC_CATEGORIES, generateQuestionSequence, processAnswer } from '../data/magicData';

export const useMagicMode = () => {
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  const toggleMagicMode = useCallback(() => {
    setIsMagicMode(prev => !prev);
    if (!isMagicMode) {
      // Reset when entering magic mode
      setCurrentCategory(null);
      setCurrentQuestionIndex(0);
      setQuestions([]);
      setRemainingWords([]);
      setSelectedSet(null);
    }
  }, [isMagicMode]);

  const initializeCategory = useCallback((category) => {
    const categoryData = MAGIC_CATEGORIES[category.toLowerCase()];
    if (!categoryData) return false;

    setCurrentCategory(category.toLowerCase());
    // Start with both sets combined for the initial question
    const allWords = [...categoryData.setA, ...categoryData.setB];
    setRemainingWords(allWords);
    
    // Generate questions for both sets (we'll filter later based on first answer)
    const questionsA = generateQuestionSequence(category.toLowerCase(), 'A');
    setQuestions(questionsA);
    setCurrentQuestionIndex(0);
    setSelectedSet(null);
    
    return true;
  }, []);

  const getCurrentQuestion = useCallback(() => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
      return null;
    }
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  const processScrollAnswer = useCallback((isLeftColumn) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    if (currentQuestion.type === 'category') {
      // First question - determine which set they chose
      const categoryData = MAGIC_CATEGORIES[currentCategory];
      const chosenSet = isLeftColumn ? 'A' : 'B';
      const chosenWords = isLeftColumn ? categoryData.setA : categoryData.setB;
      
      setSelectedSet(chosenSet);
      setRemainingWords(chosenWords);
      
      // Regenerate questions for the chosen set
      const newQuestions = generateQuestionSequence(currentCategory, chosenSet);
      setQuestions(newQuestions);
    } else if (currentQuestion.type === 'letter') {
      // Process letter question
      const answer = isLeftColumn ? 'left' : 'right';
      const newWords = processAnswer(remainingWords, currentQuestion, answer);
      setRemainingWords(newWords);
    }

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
  }, [getCurrentQuestion, currentCategory, remainingWords]);

  const reset = useCallback(() => {
    setCurrentCategory(null);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setRemainingWords([]);
    setSelectedSet(null);
  }, []);

  const isComplete = useCallback(() => {
    return remainingWords.length <= 1 || currentQuestionIndex >= questions.length;
  }, [remainingWords.length, currentQuestionIndex, questions.length]);

  const getFinalAnswer = useCallback(() => {
    if (remainingWords.length === 1) {
      return remainingWords[0];
    }
    return remainingWords; // Multiple possibilities
  }, [remainingWords]);

  return {
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
    currentQuestionIndex,
    questionsLength: questions.length
  };
};
