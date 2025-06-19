import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [includeAdult, setIncludeAdult] = useState(false);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () => fetchMovies({ query: searchQuery, page, includeAdult }),
    [searchQuery, page, includeAdult]
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

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setPage(1);
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                placeholder="search movies..."
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text onPress={toggleAdult} className="text-accent">
                    {searchQuery}
                  </Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? "No Movies Found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
      {movies?.length > 0 && (
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
          <Text className="text-light-200 text-xs">Page {page}</Text>

          <TouchableOpacity
            className={`bg-purple-500 py-1 px-2 flex items-center justify-center ${
              movies?.length !== 20 ? "bg-gray-300" : "bg-purple-500 "
            }`}
            onPress={nextPage}
          >
            <Image source={icons.arrow} className="size-5 " tintColor="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default search;
