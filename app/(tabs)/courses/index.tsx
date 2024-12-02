import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserCourses, addCourse, checkSession } from '@/lib/queries';
import Button from '@/components/Button';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch user ID on component mount or check session
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await checkSession(); // Assuming checkSession returns user data with user_id
        if (user && user.id) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUserId();
  }, []);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userCourses = await getUserCourses();
        setCourses(userCourses);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourseTitle) {
      Alert.alert("Error", "Course title cannot be empty.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    try {
      const newCourse = { title: newCourseTitle, user_id: userId.toString() };
      const result = await addCourse(newCourse);

      if (result) {
        setCourses([...courses, result]);
        setNewCourseTitle("");
        setModalVisible(false);
        
        Alert.alert("Success", "Course added successfully!");
      } else {
        Alert.alert("Error", "Failed to add course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      Alert.alert("Error", "An error occurred while adding the course.");
    }
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1836E3" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Courses</Text>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()} // Use the course ID as the key
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
      />
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={50} color="#1836E3" />
      </TouchableOpacity>

      {/* Modal for adding new course */}
      <Modal 
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.addTitle}>Add a New Course</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course title"
            value={newCourseTitle}
            onChangeText={setNewCourseTitle}
          />
          <Button title="Add Course" onPress={handleAddCourse} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CoursesPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9F2FF",
    flex: 1,
    padding: 20,
  },
  header: {
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 20,
    color: "#1836E3",
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  courseItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  addTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1836E3',
  },
});
