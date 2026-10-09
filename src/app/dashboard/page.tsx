import React from 'react';
import { Metadata } from 'next';
import DashboardView from '@/components/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Shop Owner Dashboard — Netrawebai',
  description: 'Manage your active Indian business websites, edit saved drafts, and view visitor inquiry links.',
};

export default function DashboardPage() {
  return <DashboardView />;
}
