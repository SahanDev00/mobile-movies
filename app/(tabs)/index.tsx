import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [includeAdult, setIncludeAdult] = useState(false);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(
    () => fetchMovies({ query: "", page, includeAdult }),
    [page, includeAdult]
  );

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleAdult = () => {
    setIncludeAdult((prev) => !prev);
    setPage(1); // optional: reset page when toggling
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError ? (
          <Text>Error: {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            <>
              <Text className="text-lg text-white font-bold mt-5">
                Latest Movies
              </Text>
            </>
            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2"
              scrollEnabled={false}
            ></FlatList>
          </View>
        )}
        <View className="flex-row justify-between items-center px-4 pb-32 mt-5">
          <TouchableOpacity
            className={`py-1 px-2 flex items-center justify-center ${
              page === 1 ? "bg-gray-300" : "bg-purple-500 "
            }`}
            onPress={prevPage}
          >
            <Image
              source={icons.arrow}
              className="size-5 rotate-180"
              tintColor="#fff"
            />
          </TouchableOpacity>
          <Text onPress={toggleAdult} className="text-light-200 text-xs">
            Page {page}
          </Text>
          <TouchableOpacity
            className="bg-purple-500 py-1 px-2 flex items-center justify-center"
            onPress={nextPage}
          >
            <Image source={icons.arrow} className="size-5 " tintColor="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
