import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../ScanScreen.styles';

interface ScanPermissionViewProps {
  hasPermission: boolean | null;
}

export const ScanPermissionView: React.FC<ScanPermissionViewProps> = ({ hasPermission }) => {
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.permissionText}>Solicitando acceso a la cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.permissionText}>
        No hay acceso a la cámara. Por favor, actívala en los ajustes.
      </Text>
    </View>
  );
};
