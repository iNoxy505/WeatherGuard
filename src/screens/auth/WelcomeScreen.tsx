import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { GradientButton } from '../../components/GradientButton';
import { FontSize, Spacing } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation loop for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/welcome_bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(10, 14, 26, 0.7)' : 'rgba(255, 255, 255, 0.4)' }]} />

      <View style={styles.content}>
        {/* Hero Logo */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: Animated.multiply(iconScale, pulseAnim) }],
            },
          ]}
        >
          <Image 
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.appName, { color: isDark ? colors.text.primary : '#000000' }]}>WeatherGuard</Text>
          <Text style={[styles.tagline, { color: isDark ? colors.accent.cyan : '#0284C7' }]}>Intelligent Weather Safety</Text>
          <View style={[styles.divider, { backgroundColor: colors.accent.cyan }]} />
          <Text style={[styles.description, { color: isDark ? colors.text.secondary : '#333333' }]}>
            Real-time risk monitoring, emergency alerts, and community safety — all in one premium experience.
          </Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View
          style={[
            styles.features,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: isDark ? colors.text.secondary : '#333333' }]}>Live environmental telemetry</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: isDark ? colors.text.secondary : '#333333' }]}>Landslide prediction & safe exit routing</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: isDark ? colors.text.secondary : '#333333' }]}>GPS-enabled emergency SOS</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: isDark ? colors.text.secondary : '#333333' }]}>Offline-first with SMS fallback</Text>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GradientButton
            title="Get Started"
            onPress={() => navigation.navigate('SignUp')}
            size="large"
            style={styles.primaryBtn}
          />
          <GradientButton
            title="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="medium"
            style={styles.secondaryBtn}
            textStyle={{ color: isDark ? colors.accent.cyan : '#0284C7' }}
          />
        </Animated.View>
      </View>

      <Text style={[styles.version, { color: isDark ? colors.text.muted : '#555555' }]}>v1.0.0</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingTop: 50,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    marginVertical: Spacing.lg,
    borderRadius: 1,
    opacity: 0.8,
  },
  description: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xxxl,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  buttonContainer: {
    alignSelf: 'stretch',
  },
  primaryBtn: {
    marginBottom: Spacing.md,
  },
  secondaryBtn: {},
  version: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
