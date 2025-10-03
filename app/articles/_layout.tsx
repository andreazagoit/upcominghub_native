import {Stack} from "expo-router";

export default function ArticlesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Articles",
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="[slug]/index"
        options={{
          title: "Article",
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
