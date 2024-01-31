import { FontAwesome6 } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Text, View, useTheme } from '~/components/Themed';

async function postFav(id: string, count: number, image: string) {
  try {
    const response = await fetch(`/works/${id}/fav`, {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
      cache: 'default',
      body: JSON.stringify({ count, image }),
    });
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
}

export default function WorkDetailPage() {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const { id }: { id: string } = useLocalSearchParams();

  const readyMeterProgress = useSharedValue(0);
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${readyMeterProgress.value}%`,
    };
  });

  const [localFavs, setLocalFavs] = useState(0);
  const [clapDisabled, setClapDisabled] = useState(false);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [`id:${id}`],
    queryFn: async () => {
      const response = await fetch(`/works/${encodeURIComponent(id)}/details`);
      // @ts-ignore
      return await response.json();
    },
    placeholderData: () => {
      return {
        data: queryClient.getQueryData([`worksCache:${id}`]),
      };
    },
  });
  const favQuery = useQuery({
    queryKey: [`favs:${id}`],
    queryFn: async () => {
      const response = await fetch(`/works/${id}/fav`);
      // @ts-ignore
      return await response.json();
    },
  });

  useEffect(() => {
    if (favQuery.status === 'success') {
      console.log('setting local favs', favQuery.data?.favs);
      setLocalFavs(favQuery.data?.favs);
    }
  }, [favQuery.status]);

  const onPressFav = useCallback(async () => {
    readyMeterProgress.value = withSequence(
      withTiming(100, { duration: 3000 }),
      withTiming(0, { duration: 1 }),
    );
    setClapDisabled(true);
    setTimeout(() => {
      setClapDisabled(false);
    }, 3000);
    console.log('localFavs', localFavs);
    setLocalFavs(localFavs + 1);
    // flimsy code, just bail
    if (!query.data?.data.images?.web?.url) {
      return;
    }
    postFav(id, 1, query.data?.data.images.web.url);
  }, [localFavs]);

  const item = query.data?.data;

  const favs = favQuery.data?.favs;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: item?.title || 'Loading...',
        }}
      />

      <ScrollView>
        {item && (
          <Image
            style={{
              height: dimensions.width,
              width: dimensions.width,
              backgroundColor: 'whitesmoke',
            }}
            source={{ uri: item.images.web.url }}
            contentFit="contain"
            transition={100}
          />
        )}
        <View style={{ marginHorizontal: 16 }}>
          <View
            style={{
              marginBottom: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.title}>{item?.title}</Text>
            <View style={{ marginTop: 12, flexDirection: 'row' }}>
              <TouchableOpacity disabled={clapDisabled} onPress={onPressFav}>
                <FontAwesome6
                  name="hands-clapping"
                  size={20}
                  color={clapDisabled ? theme.backgroundDim : theme.tint}
                />
              </TouchableOpacity>
              {favs || localFavs ? (
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 18,
                    color: clapDisabled ? theme.backgroundDim : theme.tint,
                  }}>
                  {localFavs > favs ? localFavs : favs}
                </Text>
              ) : null}
            </View>
          </View>
          <Animated.View
            style={[
              {
                height: 3,
                backgroundColor: theme.tint,
                marginBottom: 8,
              },
              progressBarStyle,
            ]}
          />
          {!query.isPlaceholderData ? (
            <Text style={{ fontStyle: 'italic' }}>
              {item.tombstone.replace(`${item.title}, `, '')}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
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
    flex: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
