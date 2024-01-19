import { StyleSheet, TouchableOpacity } from "react-native";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image  } from "expo-image";
import { Text, View, FlatList } from "@/components/Themed";

export default function TabTwoScreen() {
  const favsQuery = useQuery({
    queryKey: [`favs`],
    queryFn: async () => {
      const response = await fetch(`/favs`);
      // @ts-ignore
      return await response.json();
    },
    refetchInterval: 7500
  });

  const favs = favsQuery.data;

  return (
    <FlatList
      data={favs}
      renderItem={({ item }) => (
        <View style={styles.imageContainerStyle}>
          <TouchableOpacity
            key={item.id}
            style={{ flex: 1 }}
            onPress={() => {

            }}
          >
            <Image
              style={styles.imageStyle}
              source={{
                uri: item.image,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      //Setting the number of column
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: 'white',
    backgroundColor: 'green',
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 50,
    right: 20,
    position: 'absolute',
  },
});