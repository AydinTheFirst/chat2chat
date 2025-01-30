const { VITE_API_URL } = import.meta.env;

export const API_URL: string = VITE_API_URL || "/api";
