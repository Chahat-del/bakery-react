import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>🥖 Our Bakery</ThemedText>
        <ThemedText style={styles.subtitle}>Fresh baked goods daily</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Featured Products</ThemedText>
        
        <View style={styles.productCard}>
          <ThemedText type="defaultSemiBold">Croissant</ThemedText>
          <ThemedText>Buttery, flaky French pastry</ThemedText>
          <ThemedText style={styles.price}>₹80</ThemedText>
        </View>

        <View style={styles.productCard}>
          <ThemedText type="defaultSemiBold">Sourdough Bread</ThemedText>
          <ThemedText>Artisan fresh-baked loaf</ThemedText>
          <ThemedText style={styles.price}>₹150</ThemedText>
        </View>

        <View style={styles.productCard}>
          <ThemedText type="defaultSemiBold">Chocolate Cake</ThemedText>
          <ThemedText>Rich chocolate layer cake</ThemedText>
          <ThemedText style={styles.price}>₹450</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">About Us</ThemedText>
        <ThemedText>
          We're a family-owned bakery serving fresh, handcrafted baked goods since 2020. 
          All our products are made with love and the finest ingredients.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    padding: 20,
    gap: 16,
  },
  productCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4854d',
    marginTop: 8,
  },
});