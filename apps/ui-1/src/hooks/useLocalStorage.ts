import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

const isBrowser = () => {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
};

type UseLocalStorageParams<T> = {
  key: string;
  defaultValue: T;
};

const useLocalStorage = <T>({
  key,
  defaultValue,
}: UseLocalStorageParams<T>) => {
  const defaultRef = useRef(defaultValue);
  const [value, setValue] = useState(defaultValue);

  useLayoutEffect(() => {
    defaultRef.current = defaultValue;
  });

  useEffect(() => {
    const read = (): T => {
      try {
        if (!isBrowser()) {
          console.log(
            `Not in a browser environment. Returning default value for key ${key}.`,
          );
          return defaultRef.current;
        }

        const serialized = localStorage.getItem(key);
        if (serialized) {
          const wrapper = JSON.parse(serialized);
          return wrapper.data as T;
        }
        return defaultRef.current;
      } catch (error) {
        console.error(`Error reading from localStorage for key ${key}:`, error);
        return defaultRef.current;
      }
    };

    setValue(read());
  }, [key]);

  // useCallback for stable ref:
  // prevent unnecessary re-renders or
  // potential infinite loops when this hook is set in a dependency array.
  const save = useCallback(
    (state: T) => {
      try {
        const wrapper = {
          dateModified: new Date().toISOString(),
          data: state,
        };
        localStorage.setItem(key, JSON.stringify(wrapper));
        setValue(state);
      } catch (error) {
        console.error(`Error saving to localStorage for key ${key}:`, error);
      }
    },
    [key],
  );

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(defaultRef.current);
    } catch (error) {
      console.error(`Error clearing localStorage for key ${key}:`, error);
    }
  }, [key]);

  return { value, save, clear };
};

export default useLocalStorage;
