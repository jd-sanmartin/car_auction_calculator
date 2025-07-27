import axios, { AxiosError } from "axios";
import type {
  BidFormData,
  BidFormResponse,
  FormErrorsFromServer,
} from "../types/bids";

class BidService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/bids`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Calculates the bid fees based on the provided form data.
   * @throws {FormErrors} If there are validation errors from the server.
   * @throws {Error} If there is another type of error.
   */
  async calculate(formData: BidFormData) {
    try {
      const response = await this.axiosInstance.post<BidFormResponse>(
        "/calculate",
        formData
      );
      return response.data;
    } catch (error) {
      // This would only be used in development environments
      console.error("Error calculating bid:", error);

      // I think errors and responses could have a more complex structure, however I will keep it simple
      if (error instanceof AxiosError) {
        if (
          error.response?.status === 400 &&
          error.code === "ERR_BAD_REQUEST"
        ) {
          if (error.response.data?.errors)  throw error.response.data.errors as FormErrorsFromServer;
        }
      }
    }
  }
}

export const bidService = new BidService();
