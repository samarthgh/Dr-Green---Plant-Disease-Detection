import React from 'react';
import { View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

// Helper function to parse the diagnosis string into crop and disease.
const parseDiagnosis = (diagnosisString) => {
  if (!diagnosisString) return { crop: 'Unknown', disease: 'Unknown' };
  const parts = diagnosisString.split(' ');
  if (parts.length < 2) return { crop: diagnosisString, disease: '' };
  const crop = parts[parts.length - 1];
  const disease = parts.slice(0, parts.length - 1).join(' ');
  const formattedCrop = crop.charAt(0).toUpperCase() + crop.slice(1);
  const formattedDisease = disease.charAt(0).toUpperCase() + disease.slice(1);
  return { crop: formattedCrop, disease: formattedDisease };
};

const ResultsScreen = ({ route, navigation }) => {
  const { imageUri, diagnosis } = route.params || {};
  // Parse the diagnosis string into separate crop and disease fields.
  const { crop, disease } = diagnosis ? parseDiagnosis(diagnosis.disease) : { crop: 'Unknown', disease: 'Unknown' };

  return (
    <ImageBackground 
      source={require('../assets/LeafBgMeta.jpeg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Top Section: Title and Image */}
        <View style={styles.topSection}>
          
          {imageUri && (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image} 
              resizeMode="contain"
            />
          )}
        </View>

        {/* Middle Section: Result Card and Remedies Box */}
        <View style={styles.middleSection}>
          <View style={styles.resultsContainer}>
          <BlurView intensity={19} tint="light" style={styles.resultCard}>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Crop: </Text>
              <Text style={styles.value}>{crop}</Text>
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Disease: </Text>
              <Text style={styles.value}>{disease}</Text>
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Confidence: </Text>
              <Text style={styles.value}>
          {diagnosis ? diagnosis.confidence * 100 : 'N/A'}%
        </Text>
      </Text>
    </BlurView>
            <BlurView intensity={19} tint="light" style={styles.remediesBox}>
              <Text style={styles.remediesTitle}>Remedies</Text>
              <Text style={styles.remediesText}>
                Please consult your local agricultural extension service for tailored recommendations.
              </Text>
            </BlurView>
          </View>
        </View>

        {/* Bottom Section: Scan Another Leaf Button */}
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Landing')}>
          <Text style={styles.buttonText}>Scan Another Leaf</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(58,122,72,0.7)', // Semi-transparent green overlay
    padding: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 100, // Adjust as needed for your design
    marginBottom: -50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'beige',
    marginBottom: 5,
    fontFamily: Platform.OS === 'android' ? 'Avenir' : 'Avenir',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  middleSection: {
    width: '100%',
    alignItems: 'center',
  },
  resultsContainer: {
    width: '100%',
    position: 'relative', // Parent for absolute positioning of remediesBox
    marginTop: 10,
    marginBottom: 100, // Reserve space for remediesBox if needed
  },
  resultCard: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'flex-start',
    // No marginBottom here, so it stays in place
    overflow: 'hidden', // Ensure the blur effect is contained
  },
  resultText: {
    fontSize: 18,
    fontWeight: 300,
    color: 'beige',
    marginVertical: 2,
  },
  remediesBox: {
    position: 'absolute',
    top: '100%', // Position it just below the result card
    marginTop: 7, // Adjust upward overlap without affecting the result card\n    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    overflow : 'hidden',
    alignItems: 'left',
  },
  remediesTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'beige',
    marginBottom: 5,
  },
  remediesText: {
    fontSize: 18,
    color: 'beige',
    fontWeight: '300',
    textAlign: 'left',
  },
  bottomButton: {
    backgroundColor: 'beige',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#3a7a48',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    color: 'beige',
  },
  value: {
    fontWeight: 300,
    color: 'beige',
  }
});

export default ResultsScreen;
