import {Stack} from "expo-router";
import {Icon} from "expo-router/unstable-native-tabs";
import {Pressable, View} from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Account",
          headerTransparent: true,
          headerRight: () => (
            <View style={{flexDirection: "row", gap: 12}}>
              <Pressable onPress={() => {}}>
                <Icon sf="plus" />
              </Pressable>
              <Pressable onPress={() => {}}>
                <Icon sf="rectangle.portrait.and.arrow.right" />
              </Pressable>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
