import {Stack} from "expo-router";

export default function ArticlesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Articles"
        }}
      />
      <Stack.Screen
        name="[slug]/index"
        options={{
          title: "Article"
        }}
      />
    </Stack>
  );
}
