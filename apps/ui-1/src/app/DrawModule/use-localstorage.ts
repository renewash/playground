import { useEffect, useRef, useState } from "react";

const createKey = (id: string, prefix: string = "") =>
  `${prefix ? `${prefix}:` : ""}${id}`;

const useLocalStorage = <T>(
  id: string,
  defaultValue: T,
  prefix: string = "",
) => {
  const key = createKey(id, prefix);
  const defaultRef = useRef(defaultValue);

  const save = (state: T) => {
    try {
      const wrapper = {
        dateModified: new Date().toISOString(),
        data: state,
      };
      localStorage.setItem(key, JSON.stringify(wrapper));
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  };

  const load = (): T => {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized) {
        const wrapper = JSON.parse(serialized);
        return wrapper.data as T;
      }
      return defaultRef.current;
    } catch (error) {
      console.error(`Error loading from localStorage for key ${key}:`, error);
      return defaultRef.current;
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing localStorage for key ${key}:`, error);
    }
  };

  return { save, load, clear };
};

export default useLocalStorage;
