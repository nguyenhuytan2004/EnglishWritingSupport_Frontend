import apiClient from "../utils/apiClient";
import { API_ENDPOINTS } from "../constants/api";

const paragraphService = {
  getParagraph: async (paragraphId) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.PARAGRAPH}/${paragraphId}`,
      );
      return response;
    } catch (error) {
      console.error("Get paragraph error:", error);
      throw error;
    }
  },
};

export default paragraphService;
