import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const _layout = () => {
  const TabBar = ({ focused, icon, title }: any) => {
    if (focused) {
      return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
          <Image source={icon} tintColor="#fff" className="size-6 font-bold" />
        </View>
      );
    }
    return (
      <View className="size-full justify-center items-center mt-4 rounded-full">
        <Image source={icon} tintColor="#A8B5DB" className="size-5" />
      </View>
    );
  };
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#13274F",
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderColor: "#0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="listings"
        options={{
          title: "Listings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBar focused={focused} icon={icons.list} title={"Listings"} />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBar focused={focused} icon={icons.heart} title={"Likes"} />
          ),
        }}
      />
      <Tabs.Screen
        name="add_item"
        options={{
          title: "Add Item",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBar focused={focused} icon={icons.plus} title={"Add Item"} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBar focused={focused} icon={icons.chat} title={"Chat"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBar focused={focused} icon={icons.user} title={"Profile"} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
