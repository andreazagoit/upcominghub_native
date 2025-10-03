import {Stack} from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Explore",
          headerTransparent: true,
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
