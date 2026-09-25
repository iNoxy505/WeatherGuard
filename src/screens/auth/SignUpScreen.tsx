import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../state/useAuthStore';
import { useTheme } from '../../theme/ThemeContext';
import { GradientButton } from '../../components/GradientButton';
import { WeatherIcon } from '../../components/WeatherIcon';
import { FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignUp = async () => {
    setLocalError('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    await signUp(name.trim(), email.trim(), password);
  };

  const displayError = localError || error;

  return (
    <ImageBackground
      source={require('../../assets/images/welcome_bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(10, 14, 26, 0.75)' : 'rgba(255, 255, 255, 0.4)' }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backText, { color: colors.accent.cyan }]}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/logo.jpg')}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: isDark ? colors.text.primary : '#000' }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : '#333' }]}>
              Join WeatherGuard to stay safe
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {displayError ? (
              <View style={[styles.errorBox, { backgroundColor: colors.severity.critical.bg, borderColor: colors.severity.critical.accent }]}>
                <Text style={[styles.errorText, { color: colors.severity.critical.text }]}>{displayError}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Full Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bg.input, borderColor: colors.border.subtle }]}>
                <WeatherIcon name="user" size={16} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={name}
                  onChangeText={(t) => { setName(t); setLocalError(''); clearError(); }}
                  placeholder="Your full name"
                  placeholderTextColor={colors.text.muted}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bg.input, borderColor: colors.border.subtle }]}>
                <WeatherIcon name="bell" size={16} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setLocalError(''); clearError(); }}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bg.input, borderColor: colors.border.subtle }]}>
                <WeatherIcon name="shield" size={16} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setLocalError(''); clearError(); }}
                  placeholder="Min 6 characters"
                  placeholderTextColor={colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Confirm Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bg.input, borderColor: colors.border.subtle }]}>
                <WeatherIcon name="check" size={16} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setLocalError(''); clearError(); }}
                  placeholder="Re-enter password"
                  placeholderTextColor={colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <GradientButton
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              disabled={!name.trim() || !email.trim() || !password || !confirmPassword}
              size="large"
              style={styles.signUpBtn}
            />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.subtle }]} />
              <Text style={[styles.dividerText, { color: colors.text.muted }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.subtle }]} />
            </View>

            <TouchableOpacity
              style={[styles.googleBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF', borderColor: colors.border.subtle }]}
              onPress={() => {
                // Mock Google Sign up
                signUp('Google User', 'google_user@gmail.com', 'password');
              }}
            >
              <WeatherIcon name="user" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
              <Text style={[styles.googleBtnText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: colors.accent.cyan }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
    paddingBottom: Spacing.xxxl,
  },
  backBtn: {
    marginBottom: Spacing.xl,
  },
  backText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  form: {},
  errorBox: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
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
  signUpBtn: {
    marginTop: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  googleBtnText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: FontSize.md,
  },
  footerLink: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
