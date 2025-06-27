import { store } from "../redux/store";

/**
 * Fetches recommended events for the current user
 * @returns {Promise<Array>} Array of recommended events
 */
export const fetchRecommendedEvents = async () => {
  const { currentUser } = store.getState().user;
  
  if (!currentUser) {
    return [];
  }
  
  try {
    const response = await fetch(`/api/event/recommendations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};