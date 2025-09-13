import React from "react";

import {Badge, Icon, Label, NativeTabs} from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs blurEffect="systemChromeMaterial">
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Label>Explore</Label>
        <Icon
          sf={{default: "safari", selected: "safari.fill"}}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <Label>Calendar</Label>
        <Icon sf="calendar" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <Label>Account</Label>
        <Icon
          sf={{default: "person", selected: "person.fill"}}
          drawable="custom_android_drawable"
        />
        <Badge>10</Badge>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
