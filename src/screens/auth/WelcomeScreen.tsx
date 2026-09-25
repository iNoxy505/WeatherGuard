import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { BackgroundPattern } from '../../components/BackgroundPattern';
import { WeatherIcon } from '../../components/WeatherIcon';
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
      colors={colors.gradient.welcome}
      style={styles.container}
    >
      <BackgroundPattern isDark={isDark} variant="topography" />

      {/* Decorative floating orbs */}
      <View style={[styles.orb, styles.orb1, { backgroundColor: colors.accent.cyan }]} />
      <View style={[styles.orb, styles.orb2, { backgroundColor: colors.accent.amber }]} />
      <View style={[styles.orb, styles.orb3, { backgroundColor: colors.accent.cyan }]} />

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
          <View style={[styles.iconGlow, { backgroundColor: colors.accent.cyanGlow }]}>
            <View style={[styles.iconInner, { backgroundColor: `${colors.accent.cyan}20`, borderColor: `${colors.accent.cyan}50` }]}>
              <WeatherIcon name="shield" size={56} color={colors.accent.cyan} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.appName, { color: colors.text.primary }]}>WeatherGuard</Text>
          <Text style={[styles.tagline, { color: colors.accent.cyan }]}>Intelligent Weather Safety</Text>
          <View style={[styles.divider, { backgroundColor: colors.accent.cyan }]} />
          <Text style={[styles.description, { color: colors.text.secondary }]}>
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
            <Text style={[styles.featureText, { color: colors.text.secondary }]}>Live environmental telemetry</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: colors.text.secondary }]}>Landslide prediction & safe exit routing</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: colors.text.secondary }]}>GPS-enabled emergency SOS</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accent.cyan }]} />
            <Text style={[styles.featureText, { color: colors.text.secondary }]}>Offline-first with SMS fallback</Text>
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

      <Text style={[styles.version, { color: colors.text.muted }]}>v1.0.0</Text>
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
    top: -80,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -60,
  },
  orb3: {
    width: 150,
    height: 150,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    marginVertical: Spacing.lg,
    borderRadius: 1,
    opacity: 0.5,
  },
  description: {
    fontSize: FontSize.md,
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
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
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
  },
});
