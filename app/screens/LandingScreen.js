import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    ImageBackground, 
    Alert, 
    Platform, 
    TouchableOpacity, 
    Animated 
  } from 'react-native';
  import React, { useState, useEffect, useRef } from 'react';
  import AppButton from '../../components/AppButton';
  import AppText from '../../components/AppText/AppText';
  import * as ImagePicker from 'expo-image-picker';
  import * as Location from 'expo-location';
  import axios from 'axios';
  import { useNavigation } from '@react-navigation/native';
  import { format, addDays } from 'date-fns';
  
  export default function LandingScreen() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [weatherData, setWeatherData] = useState([]);
    const [locationName, setLocationName] = useState(null);
    const [location, setLocation] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const [contentPosition] = useState(new Animated.Value(0));
    const navigation = useNavigation();
    const API_KEY = 'd0a6a405227943fc855171958241112';
  
    useEffect(() => {
      // Animate active dot's position whenever currentDayIndex changes
      Animated.timing(slideAnimation, {
        toValue: currentDayIndex * 20,
        duration: 80,
        useNativeDriver: false,
      }).start();
      Animated.timing(contentPosition, {
        toValue: -currentDayIndex * 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [currentDayIndex]);
  
    const handleUploadFromGallery = async () => {
      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Denied', 'Please enable permissions to access the gallery.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled && result.assets && result.assets[0].uri) {
          const uri = result.assets[0].uri;
          setSelectedImage(uri);
          setIsLoading(true);
          try {
            await classifyImage(uri);
          } catch (error) {
            Alert.alert('Error', 'Failed to analyze image');
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert('Error', 'Something went wrong while picking an image.');
      }
    };
  
    const handleClickPhoto = async () => {
      try {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Denied', 'Please enable permissions to use the camera.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled && result.assets && result.assets[0].uri) {
          const uri = result.assets[0].uri;
          setSelectedImage(uri);
          setIsLoading(true);
          try {
            await classifyImage(uri);
          } catch (error) {
            Alert.alert('Error', 'Failed to analyze photo');
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while capturing a photo.');
      }
    };
  
    // Fetch weather data from API
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const forecastResponse = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3&aqi=no`
        );
        const forecastData = forecastResponse.data.forecast;
        if (forecastData && forecastData.forecastday) {
          const todayDate = format(new Date(), 'yyyy-MM-dd');
          const tomorrowDate = format(addDays(todayDate, 1), 'yyyy-MM-dd');
          const dayAfterTomorrowDate = format(addDays(todayDate, 2), 'yyyy-MM-dd');
          const interestedDates = [todayDate, tomorrowDate, dayAfterTomorrowDate];
          const filteredForecasts = forecastData.forecastday.filter(forecast => {
            return interestedDates.includes(forecast.date);
          }).map((forecast) => {
            return {
              date: forecast.date,
              description: forecast.day.condition.text,
              tempRange: `${Math.round(forecast.day.mintemp_c)}°C / ${Math.round(forecast.day.maxtemp_c)}°C`,
              icon: forecast.day.condition.icon,
            };
          });
          setWeatherData(filteredForecasts);
        } else {
          console.error('Forecast data is missing');
          Alert.alert('Error', 'Unable to fetch forecast data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        Alert.alert('Error', 'Unable to fetch weather data. Please try again later.');
      }
    };
  
    // Real API integration for classification
    const classifyImage = async (imageUri) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          name: 'leaf.jpg',
          type: 'image/jpeg',
        });
  
        // Replace the URL below with your backend API endpoint
        const response = await fetch('http://192.168.0.103:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const diagnosis = await response.json();
        // Navigate to ResultsScreen with real diagnosis and image URI
        navigation.navigate('Results', { imageUri, diagnosis });
      } catch (error) {
        Alert.alert("Error", "Failed to analyze image");
        console.error("Upload error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Please enable location permissions to view weather updates.');
          return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        const { latitude, longitude } = userLocation.coords;
        fetchWeatherData(latitude, longitude);
        let geoLocation = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geoLocation.length > 0) {
          setLocationName(geoLocation[0].city || geoLocation[0].region || 'Unknown Location');
        }
      })();
    }, []);
  
    const handleNextDay = () => {
      if (currentDayIndex < weatherData.length - 1) {
        setCurrentDayIndex(currentDayIndex + 1);
      }
    };
  
    const handlePrevDay = () => {
      if (currentDayIndex > 0) {
        setCurrentDayIndex(currentDayIndex - 1);
      }
    };
  
    return (
      <View style={styles.Bg}>
        <ImageBackground style={styles.BgImage} source={require('../assets/LeafBgMeta.jpeg')} />
  
        <View style={styles.UploadButton}>
          <AppButton title="Upload from gallery" onPress={handleUploadFromGallery} />
        </View>
  
        <View style={styles.TitleContainer}>
          <Image style={styles.Logo} source={require('../assets/BTPLogo.png')} />
          <Text style={styles.TitleText}>Dr. Green</Text>
        </View>
  
        <View style={styles.IntroContainer}>
          <AppText>Transforming Agriculture with AI</AppText>
        </View>
  
        <Text style={styles.OrText}>Or</Text>
  
        <View style={styles.PhotoButton}>
          <AppButton title="Click a photo" onPress={handleClickPhoto} />
        </View>
  
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>🌤 Weather Update ☀️</Text>
          {weatherData.length > 0 ? (
            <View style={styles.weatherCard}>
              <Image
                source={{ uri: `https:${weatherData[currentDayIndex].icon}` }}
                style={styles.weatherIcon}
              />
              <Text style={styles.weatherTemp}>{weatherData[currentDayIndex].tempRange}</Text>
              <Text style={styles.weatherLocation}>{locationName ? locationName : 'Loading location...'}</Text>
              <Text style={styles.weatherDate}>
                {weatherData[currentDayIndex].date
                  ? format(new Date(weatherData[currentDayIndex].date), 'dd MMMM')
                  : 'Loading...'}
              </Text>
              <Text style={styles.weatherDescription}>{weatherData[currentDayIndex].description}</Text>
  
              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  onPress={handlePrevDay}
                  disabled={currentDayIndex === 0}
                  style={[styles.arrowButton, { opacity: currentDayIndex === 0 ? 0.3 : 1 }]}>
                  <Text style={styles.arrowText}>←</Text>
                  <Text style={styles.buttonLabel}>Prev Day</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  onPress={handleNextDay}
                  disabled={currentDayIndex === weatherData.length - 1}
                  style={[styles.arrowButton, { opacity: currentDayIndex === weatherData.length - 1 ? 0.3 : 1 }]}>
                  <Text style={styles.arrowText}>→</Text>
                  <Text style={styles.buttonLabel}>Next Day</Text>
                </TouchableOpacity>
              </View>
  
              <View style={styles.dotsContainer}>
                {weatherData.map((_, index) => (
                  <Text key={index} style={styles.dot}>•</Text>
                ))}
                <Animated.View style={[styles.animatedDot, { transform: [{ translateX: slideAnimation }] }]}>
                  <Text style={styles.activeDot}>•</Text>
                </Animated.View>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading weather data...</Text>
          )}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    weatherLocation: {
      fontSize: 14,
      fontWeight: 'condensed',
      color: 'beige',
      marginTop: 5,
    },
    Bg: {
      flex: 1,
      backgroundColor: '#3a7a48',
      justifyContent: 'center',
      alignItems: 'center',
    },
    Logo: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    BgImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.25,
      resizeMode: 'cover',
    },
    PhotoButton: {
      width: '80%',
      paddingVertical: 12,
      alignItems: 'center',
      position: 'absolute',
      top: '35%',
    },
    UploadButton: {
      width: '80%',
      paddingVertical: 12,
      alignItems: 'center',
      position: 'absolute',
      top: '23%',
    },
    OrText: {
      alignItems: 'center',
      fontSize: 20,
      color: 'beige',
      fontFamily: Platform.OS === 'android' ? 'Avenir' : 'Avenir',
      position: 'absolute',
      top: '32%',
      fontWeight: 'bold',
    },
    TitleText: {
      fontSize: 25,
      color: 'beige',
      fontFamily: Platform.OS === 'android' ? 'Avenir' : 'Avenir',
      fontWeight: 'bold',
      marginLeft: 1,
    },
    TitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      top: '7%',
      padding: 10,
      borderRadius: 10,
      ...Platform.select({
        ios: {
          shadowColor: '#ffffff',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 7,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    IntroContainer: {
      position: 'absolute',
      top: '15.5%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 10,
      borderRadius: 10,
    },
    weatherContainer: {
      position: 'absolute',
      bottom: 120,
      width: '90%',
      alignItems: 'center',
    },
    weatherTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'beige',
      marginBottom: 10,
    },
    weatherCard: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 10,
      alignItems: 'center',
      justifyContent: 'flex-start',
      maxHeight: 190,
    },
    weatherIcon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    weatherDate: {
      fontSize: 14,
      fontWeight: 'condensed',
      color: 'beige',
      marginTop: 5,
    },
    weatherDescription: {
      fontSize: 14,
      color: 'beige',
      textAlign: 'center',
      marginVertical: 5,
    },
    weatherTemp: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
    },
    arrowButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
      bottom: 90,
    },
    arrowText: {
      fontSize: 30,
      color: 'beige',
    },
    buttonLabel: {
      fontSize: 12,
      color: 'beige',
      marginTop: 5,
    },
    dotsContainer: {
      flexDirection: 'row',
      bottom: '40%',
    },
    dot: {
      fontSize: 21,
      color: '#2e3831', 
      marginHorizontal: 5,
    },
    activeDot: {
      fontSize: 21,
      marginHorizontal: 5,
      color: 'white',
    },
    animatedDot: {
      position: 'absolute',
    },
  });
  
  