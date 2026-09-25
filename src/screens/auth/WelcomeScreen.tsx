import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { WeatherIcon } from '../../components/WeatherIcon';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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

    // Pulse animation loop for the shield icon
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
    <LinearGradient
      colors={Colors.gradient.welcome}
      style={styles.container}
    >
      {/* Decorative floating orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />

      <View style={styles.content}>
        {/* Hero Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: Animated.multiply(iconScale, pulseAnim) }],
            },
          ]}
        >
          <View style={styles.iconGlow}>
            <View style={styles.iconInner}>
              <WeatherIcon name="shield" size={56} color={Colors.accent.cyan} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>WeatherGuard</Text>
          <Text style={styles.tagline}>Intelligent Weather Safety</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
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
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Live environmental telemetry</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>GPS-enabled emergency SOS</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Offline-first with SMS fallback</Text>
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
          />
        </Animated.View>
      </View>

      <Text style={styles.version}>v1.0.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.accent.cyan,
    top: -80,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.accent.amber,
    bottom: 100,
    left: -60,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: Colors.accent.cyan,
    bottom: -30,
    right: -40,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  iconGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent.cyanGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.lg,
    color: Colors.accent.cyan,
    fontWeight: '600',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.accent.cyan,
    marginVertical: Spacing.lg,
    borderRadius: 1,
    opacity: 0.5,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xxxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xl,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent.cyan,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    fontWeight: '500',
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
    color: Colors.text.muted,
  },
});
