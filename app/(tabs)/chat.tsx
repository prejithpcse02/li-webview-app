import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Define message type
interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  time?: string;
  type?: "message" | "offer" | "accepted" | "review";
  amount?: number;
}

// Dummy data for chat messages
const dummyMessages: Message[] = [
  {
    id: "1",
    text: "Hi, is the price negotiable? What is your best price?",
    sender: "user",
    time: "2:30 PM",
    type: "message",
  },
  {
    id: "2",
    text: "I can reduce it to 50 if you can collect it today",
    sender: "other",
    time: "2:31 PM",
    type: "message",
  },
  {
    id: "3",
    text: "Sure, I can collect today.",
    sender: "user",
    time: "2:32 PM",
    type: "message",
  },
  {
    id: "4",
    text: "Made offer: A$ 50",
    sender: "user",
    type: "offer",
    amount: 50,
  },
  {
    id: "5",
    text: "Accepted offer: A$ 50",
    sender: "other",
    type: "accepted",
    amount: 50,
  },
  {
    id: "6",
    text: "Can I collect it at 6pm? Pls pass me your address.",
    sender: "user",
    time: "2:35 PM",
    type: "message",
  },
  {
    id: "7",
    text: "6pm is okay. 207 Centre Road, Bentleigh East, VIC 3204. See you.",
    sender: "other",
    time: "2:36 PM",
    type: "message",
  },
  {
    id: "8",
    text: "See you.",
    sender: "user",
    time: "2:37 PM",
    type: "message",
  },
  {
    id: "9",
    text: "Wrote a review",
    sender: "user",
    type: "review",
  },
  {
    id: "10",
    text: "Wrote a review",
    sender: "other",
    type: "review",
  },
];

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(dummyMessages);

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "message",
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (
      item.type === "offer" ||
      item.type === "accepted" ||
      item.type === "review"
    ) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === "user" ? styles.userMessage : styles.otherMessage,
        ]}
      >
        {item.sender === "other" && (
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={30} color="#ccc" />
          </View>
        )}
        <View style={styles.messageContent}>
          <View
            style={[
              styles.messageBubble,
              item.sender === "user" ? styles.userBubble : styles.otherBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "user"
                  ? styles.userMessageText
                  : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
          </View>
          {item.time && (
            <Text
              style={[
                styles.timeText,
                item.sender === "user"
                  ? styles.userTimeText
                  : styles.otherTimeText,
              ]}
            >
              {item.time}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.dummyBadge}>
          <Text style={styles.dummyBadgeText}>Dummy UI</Text>
        </View>
      </View>

      <View style={styles.dummyBanner}>
        <Ionicons name="information-circle" size={20} color="#666" />
        <Text style={styles.dummyBannerText}>
          This is a demo interface. Chat functionality will be implemented in a
          future update.
        </Text>
      </View>

      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>
            IKEA MICKIE study desk condition
          </Text>
          <Text style={styles.productPrice}>A$ 60</Text>
          <Text style={styles.sellerName}>Nick name</Text>
        </View>
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#ccc" />
        </View>
      </View>

      <View style={styles.offerButtons}>
        <TouchableOpacity style={[styles.offerButton, styles.cancelButton]}>
          <Text style={styles.cancelButtonText}>Cancel offer</Text>
        </TouchableOpacity>
        <View style={styles.currentOffer}>
          <Text style={styles.currentOfferText}>A$ 50</Text>
        </View>
        <TouchableOpacity style={[styles.offerButton, styles.amendButton]}>
          <Text style={styles.amendButtonText}>Amend offer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="image-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={message.trim() === ""}
        >
          <Ionicons
            name="arrow-up-circle"
            size={36}
            color={message.trim() === "" ? "#ccc" : "#666"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    position: "relative",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 16,
    flex: 1,
  },
  dummyBadge: {
    backgroundColor: "#FFE4B5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dummyBadgeText: {
    color: "#B8860B",
    fontSize: 10,
    fontWeight: "bold",
  },
  dummyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dummyBannerText: {
    marginLeft: 8,
    color: "#666666",
    fontSize: 12,
    flex: 1,
  },
  productHeader: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: "#666666",
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  offerButtons: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
  },
  offerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#E5E5E5",
  },
  amendButton: {
    backgroundColor: "#E5E5E5",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  amendButtonText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  currentOffer: {
    paddingHorizontal: 16,
  },
  currentOfferText: {
    fontSize: 14,
    color: "#666666",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  messageContent: {
    flex: 1,
  },
  userMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  avatar: {
    marginRight: 8,
    marginLeft: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#E8F1FF",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: "#000000",
  },
  otherMessageText: {
    color: "#000000",
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    color: "#8E8E93",
  },
  userTimeText: {
    alignSelf: "flex-end",
  },
  otherTimeText: {
    alignSelf: "flex-start",
  },
  systemMessage: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 12,
  },
  systemMessageText: {
    fontSize: 12,
    color: "#666666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  attachButton: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
  },
});

export default Chat;
