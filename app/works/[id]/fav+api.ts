import { type ExpoRequest, ExpoResponse } from 'expo-router/server';
import storage from 'node-persist';

export async function GET(request: ExpoRequest) {
  const store = await getStoreAsync();

  // Abort if no (work) id is provided
  const id = request.expoUrl.searchParams.get('id');
  if (!id) return ExpoResponse.json({ error: 'No work id provided' }, { status: 400 });

  // Return the stored favorites, if any
  const favorites = (await store.getItem('favs')) || {};
  return ExpoResponse.json({ favs: favorites[id] || 0 });
}

export async function POST(request: ExpoRequest) {
  const store = await getStoreAsync();

  // Abort if no (work) id is provided
  const id = request.expoUrl.searchParams.get('id');
  if (!id) return ExpoResponse.json({ error: 'No work id provided' }, { status: 400 });

  // Abort if no image is sent
  const body = await request.json();
  if (!body.image) return ExpoResponse.json({ error: 'No image provided' }, { status: 400 });

  // Load the favorites and images from local store
  const [favorites, images] = await Promise.all([
    store.getItem('favs').then((data) => data || {}),
    store.getItem('images').then((data) => data || {}),
  ]);

  // Mutate both favorites and images
  favorites[id] = (favorites[id] || 0) + 1;
  images[id] = body.image;

  // Store the updated data back to local store
  // prettier-ignore
  await Promise.all([
    store.setItem('favs', favorites),
    store.setItem('images', images),
  ]);

  return ExpoResponse.json({ favs: favorites[id] });
}

// The shared instance
let _store: storage.LocalStorage;
// Create a single persisting local storage
// Note, this is UNSAFE for serverless, but works in our local dev server
async function getStoreAsync() {
  if (!_store) {
    await storage.init({
      dir: './storage',
      expiredInterval: 0,
      writeQueue: true, // Avoid potential overwrites when spamming
    });
    _store = storage;
  }

  return _store;
}
