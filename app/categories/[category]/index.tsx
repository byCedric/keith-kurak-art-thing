import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View, FlatList, useTheme, LoadingShade } from '~/components/Themed';

export default function CategoryPage() {
  const theme = useTheme();
  const { category }: { category: string } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [`category:${category}`],
    queryFn: () =>
      fetch(`/categories/${encodeURIComponent(category)}/works`).then((response) =>
        response.json(),
      ),
  });

  useEffect(() => {
    if (query.status === 'success') {
      query.data?.data.forEach((item: any) => {
        queryClient.setQueryData([`worksCache:${item.id}`], {
          images: { web: { url: item.images.web.url } },
        });
      });
    }
  }, [query.status]);

  return (
    <>
      <Stack.Screen options={{ title: category }} />
      <FlatList
        data={query.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link asChild href={`/works/${item.id}/`}>
            <Pressable>
              <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={{ fontStyle: 'italic' }}>
                    {item.creation_date_earliest !== item.creation_date_latest
                      ? `${item.creation_date_earliest}-${item.creation_date_latest}`
                      : `${item.creation_date_earliest}`}
                  </Text>
                </View>
                <Image
                  style={{ height: 100, width: 100 }}
                  source={{ uri: item.images.web.url }}
                  contentFit="contain"
                  transition={1000}
                />
              </View>
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.backgroundDim }]} />
        )}
      />
      <LoadingShade isLoading={query.isPending} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
