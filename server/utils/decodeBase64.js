export const decodeBase64 =(encodedString) => {
    try {
      const decodedString = atob(encodedString)
      return JSON.parse(decodedString)
    } catch (error) {
      console.error("Error decoding base64 string:", error)
      throw new Error("Invalid payment data")
    }
  }