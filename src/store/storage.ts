import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/auth';

const KEY_AUTH = '@@rm/auth';

export async function storageSave(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

export async function storageLoad<T = any>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (e) {
    console.error('Error loading from storage:', e);
    return null;
  }
}

export async function storageRemove(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from storage:', e);
  }
}

export function useHydrateStores() {
  const [ready, setReady] = useState(false);
  const hydrateAuth = useAuthStore(state => state.hydrate);

  useEffect(() => {
    async function hydrate() {
      try {
        const authData = await storageLoad(KEY_AUTH);
        if (authData) {
          hydrateAuth(authData);
        }
      } catch (e) {
        console.error('Hydration failed:', e);
      } finally {
        setReady(true);
      }
    }
    
    hydrate();
  }, [hydrateAuth]);

  return ready;
}