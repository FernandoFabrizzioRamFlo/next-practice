//ozcabaudit\src\app\(app)\home\layout.tsx
import type { Metadata } from 'next';
import HomeWrapper from "@/app/(app)/home/HomeWrapper"

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tu panel principal',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HomeWrapper>{children}</HomeWrapper>;
}