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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../state/useAuthStore';
import { GradientButton } from '../../components/GradientButton';
import { WeatherIcon } from '../../components/WeatherIcon';
import { Colors, FontSize, Spacing, BorderRadius } from '../../theme/colors';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    const success = await login(email.trim(), password);
    // Navigation handled by auth state change in Navigation.tsx
  };

  return (
    <LinearGradient colors={Colors.gradient.welcome} style={styles.container}>
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
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconGlow}>
              <WeatherIcon name="shield" size={32} color={Colors.accent.cyan} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your WeatherGuard account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <WeatherIcon name="user" size={16} color={Colors.text.tertiary} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError(); }}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <WeatherIcon name="shield" size={16} color={Colors.text.tertiary} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError(); }}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showHide}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <GradientButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email.trim() || !password.trim()}
              size="large"
              style={styles.loginBtn}
            />
          </View>

          {/* Sign up link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
    paddingBottom: Spacing.xxxl,
  },
  backBtn: {
    marginBottom: Spacing.xxl,
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.accent.cyan,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  iconGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent.cyanGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  form: {},
  errorBox: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.severity.critical.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: Spacing.lg,
    height: 52,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  showHide: {
    color: Colors.accent.cyan,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
  },
  footerLink: {
    color: Colors.accent.cyan,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
