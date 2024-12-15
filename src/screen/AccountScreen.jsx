import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Header from "../components/Header";
import { fonts } from "../utils/fonts";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const AccountScreen = ({ navigation }) => {
  const { user, logOut } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogOut = () => {
    logOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "LOGIN" }],
    });
  };

  useEffect(() => {
    if (user && user.token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            "https://clothing-store-vbrf.onrender.com/profile",
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.status === 200) {
            setUserData(response.data);
          } else {
            throw new Error("Failed to load data");
          }
        } catch (error) {
          console.error("Error Fetching User Data :", error);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E96E6E" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          User Not Authenticated. Please Log In.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
      <View style={styles.header}>
        <Header isProfile={true} />
      </View>

      <View style={styles.contentContainer}>
        {userData ? (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri:
                    userData.profileImage ||
                    "https://path-to-placeholder-image.jpg",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.flexRowContainer}>
                <Text style={styles.detailsTitle}>Phone :</Text>
                <Text style={styles.detailsValue}>
                  {userData.phone || "Loading..."}
                </Text>
              </View>

              <View style={styles.flexRowContainer}>
                <Text style={styles.detailsTitle}>Address :</Text>
                <Text style={styles.detailsValue}>
                  {userData.address || "Loading..."}
                </Text>
              </View>

              <View style={styles.flexRowContainer}>
                <Text style={styles.detailsTitle}>Joined :</Text>
                <Text style={styles.detailsValue}>
                  {userData.joinedDate || "Loading..."}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>Failed To Load User Data.</Text>
        )}

        <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {},
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#444",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#757575",
  },
  detailsContainer: {
    marginVertical: 20,
  },
  flexRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  detailsTitle: {
    fontSize: 18,
    color: "#757575",
    fontWeight: "500",
  },
  detailsValue: {
    fontSize: 18,
    color: "#444",
    fontWeight: "600",
  },
  logOutButton: {
    backgroundColor: "#E96E6E",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: fonts.regular,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AccountScreen;
