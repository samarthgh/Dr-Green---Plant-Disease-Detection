import React from 'react';
import { View , StyleSheet , Text, TouchableOpacity, TouchableHighlight, Vibration, Touchable} from 'react-native';
import * as Haptics from 'expo-haptics'; // Correct import for Expo

function AppButton({title,onPress}) {

    const handlePress = async () => {
        // Trigger vibration for 300 milliseconds
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); // Light feedback style

        
        // Call the onPress function passed as a prop (if exists)
        if (onPress) {
          onPress();
        }
    

    };

    return (
        <TouchableOpacity 
        style={styles.button} 
        activeOpacity = {0.6} 
        onPress={handlePress}>
            <View>
                <Text style = {styles.text}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'beige',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '80%', // Keep for now
        maxWidth: 350, // Set a max width for larger devices
        minWidth: 200, // Set a min width for smaller devices
      },

    text: {
        color : '#3a7a48',
        fontSize:18,
        fontWeight:'bold'
    }
})
export default AppButton;