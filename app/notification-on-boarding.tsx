import {router} from "expo-router";
import React from "react";
import {View} from "react-native";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";

const NotificationOnBoardingScreen = () => {
  return (
    <View className="flex-1 bg-white dark:bg-black px-5 justify-end pb-8">
      <Text variant="title" className="text-center mb-5">
        Stay Connected with Push Notifications
      </Text>
      <Text className="text-center mb-5 text-zinc-600 dark:text-zinc-400">
        We'll send you a notification when you have a new message.
      </Text>
      
      <Button onPress={() => {}} className="mb-4">
        Allow Notifications
      </Button>

      <Button variant="outline" onPress={() => router.back()}>
        Ask Me Later
      </Button>
    </View>
  );
};

export default NotificationOnBoardingScreen;
