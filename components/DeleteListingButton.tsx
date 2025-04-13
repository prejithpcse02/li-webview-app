import React, { useState } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DeleteListingButtonProps {
  listingId: number;
  slug: string;
  onDelete?: () => void;
}

const DeleteListingButton: React.FC<DeleteListingButtonProps> = ({
  listingId,
  slug,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to delete a listing");
      router.push("/auth/signin");
      return;
    }

    if (!listingId || !slug) {
      console.error("Missing required information", { listingId, slug });
      Alert.alert(
        "Error",
        "Cannot delete listing: Missing required information"
      );
      return;
    }

    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              console.log("Deleting listing:", {
                listingId,
                slug,
                url: `/api/listings/${slug}/${listingId}/`,
              });

              const response = await api.delete(
                `/api/listings/${slug}/${listingId}/`
              );
              console.log("Delete response:", response);

              Alert.alert("Success", "Listing deleted successfully");
              if (onDelete) {
                onDelete();
              }
              router.push("/listings");
            } catch (error: any) {
              console.error("Error deleting listing:", error);
              let errorMessage = "Failed to delete listing. Please try again.";

              if (error.response) {
                console.log("Error response:", error.response);

                if (error.response.status === 404) {
                  errorMessage = "Listing not found.";
                } else if (error.response.status === 403) {
                  errorMessage =
                    "You do not have permission to delete this listing.";
                } else if (error.response.status === 401) {
                  errorMessage = "Please log in to delete this listing.";
                  router.push("/auth/signin");
                } else if (error.response.status === 500) {
                  errorMessage = "Server error. Please try again later.";
                }

                if (error.response.data?.detail) {
                  errorMessage = error.response.data.detail;
                }
              }

              Alert.alert("Error", errorMessage);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleDelete}
      disabled={isDeleting}
      className="bg-red-600 px-4 py-2 rounded-lg"
    >
      <Text className="text-white font-semibold">
        {isDeleting ? "Deleting..." : "Delete Listing"}
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteListingButton;
