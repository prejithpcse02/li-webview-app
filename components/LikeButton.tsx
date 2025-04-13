import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { api } from "@/services/api";

interface LikeButtonProps {
  listingId: number;
  initialIsLiked: boolean;
  onLikeChange: (isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  listingId,
  initialIsLiked,
  onLikeChange,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    try {
      if (isLiked) {
        await api.delete(`/api/listings/${listingId}/like/`);
      } else {
        await api.post(`/api/listings/${listingId}/like/`);
      }
      setIsLiked(!isLiked);
      onLikeChange(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "#EF4444" : "#9CA3AF"}
      />
    </TouchableOpacity>
  );
};

export default LikeButton;
