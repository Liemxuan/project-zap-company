'use client'
import { AppShell } from '../../../zap/layout/AppShell';
import { GeometryBody } from '../../../zap/sections/atoms/geometry/body';
import { useTheme } from '../../../components/ThemeContext';

export default function GeometryPage() {
    const {} = useTheme();
  return (
    <AppShell>
      <GeometryBody theme="metro" />
    </AppShell>
  );
}
