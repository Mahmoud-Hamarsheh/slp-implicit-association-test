// ... keep existing code (imports and the beginning of the component)

// Update the navigation handlers to reset page responses
const BiasAwarenessSurvey = ({ onComplete }) => {
  // ... keep existing code (state definitions)

  const handleNextPage = () => {
    // ... keep existing code (validation logic)
    
    // When moving to next page, reset page responses
    if (currentPage < surveyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      setPageResponses({});
    } else {
      // Calculate final score
      const responses = { ...formResponses };
      
      // ... keep existing code (score calculation logic)
      
      onComplete(responses);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Reset page responses when going back to previous page
      setPageResponses({});
    }
  };

  // ... keep existing code (rest of the component)
