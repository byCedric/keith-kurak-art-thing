import { ExpoRequest, ExpoResponse } from 'expo-router/server';

import cachedBaskets from '~/local-data/Basketry.json';

export async function GET(request: ExpoRequest) {
  // Abort if no category is provided
  const category = request.expoUrl.searchParams.get('category');
  if (!category) return ExpoResponse.json({ error: 'No category provided' }, { status: 400 });

  // Return cached data if available
  if (category === 'Basketry') {
    return ExpoResponse.json(cachedBaskets);
  }

  // Otherwise, try to fetch from the API
  const response = await fetch(
    `https://openaccess-api.clevelandart.org/api/artworks?has_image=1&type=${category}&limit=20&fields=id,title,images,creation_date_earliest,creation_date_latest`,
  );
  return response.ok
    ? Response.json(await response.json())
    : Response.json({ error: `Cleveland Art returned: ${response.status}` }, response);
}
