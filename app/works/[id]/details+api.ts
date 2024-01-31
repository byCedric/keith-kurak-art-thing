import { type ExpoRequest, ExpoResponse } from 'expo-router/server';

import cachedBaskets from '~/local-data/Basketry.json';

export async function GET(request: ExpoRequest) {
  // Abort if no id is provided
  const id = request.expoUrl.searchParams.get('id');
  if (!id) return ExpoResponse.json({ error: 'No id provided' }, { status: 400 });

  // Return cached data if available
  const basket = cachedBaskets.data.find((record: any) => record.id === id);
  if (basket) return ExpoResponse.json({ data: basket });

  // Otherwise, try to fetch from the API
  const response = await fetch(`https://openaccess-api.clevelandart.org/api/artworks/${id}`);
  return response.ok
    ? Response.json(await response.json())
    : Response.json({ error: `Cleveland Art returned: ${response.status}` }, response);
}
