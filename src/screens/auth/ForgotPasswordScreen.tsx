import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import { GradientButton } from '../../components/GradientButton';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const handleReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password reset instructions have been sent to your email.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }, 1500);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/welcome_bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(10, 14, 26, 0.75)' : 'rgba(255, 255, 255, 0.4)' }]} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? colors.text.primary : '#000000' }]}>Reset Password</Text>
            <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : '#333333' }]}>
              Enter the email address associated with your account, and we'll email you a link to reset your password.
            </Text>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bg.input, borderColor: colors.border.subtle }]}>
                <WeatherIcon name="user" size={16} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <GradientButton
              title="Send Reset Link"
              onPress={handleReset}
              loading={loading}
              style={styles.submitBtn}
            />

            <GradientButton
              title="Back to Login"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backBtn}
              textStyle={{ color: isDark ? colors.accent.cyan : '#0284C7' }}
            />
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: '900',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '600',
  },
  formCard: {
    padding: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    height: 52,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: Spacing.xl,
  },
  backBtn: {
    marginTop: Spacing.md,
  },
});
