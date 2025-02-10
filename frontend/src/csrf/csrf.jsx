const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value); // Decodes the cookie value
      }
    }
    return null; // Return null if the cookie is not found
};

export { getCookie }