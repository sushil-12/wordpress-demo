// utils/PromiseHandler.ts
class PromiseHandler {
    static async handle<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
      try {
        const result = await promise;
        return [result, null];
      } catch (error) {
        const enhancedError = PromiseHandler.enhanceError(error);
        return [null, enhancedError];
      }
    }
  
    private static enhanceError(error: any): Error {
      if (error.response) {
        const data = error.response.data;
        console.log(error.response.data)
        return data;
      } else if (error.request) {
        // The request was made but no response was received
        return new Error('Request did not receive a response');
      } else {
        // Something happened in setting up the request that triggered an Error
        return new Error(`Error setting up the request: ${error.message}`);
      }
    }
  }
  
  export default PromiseHandler;
  