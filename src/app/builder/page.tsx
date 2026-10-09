import React from 'react';
import { Metadata } from 'next';
import BuilderWizard from '@/components/builder/BuilderWizard';

export const metadata: Metadata = {
  title: 'Website Builder — Netrawebai | Create Your Indian Local Business Website',
  description: 'Multi-step website builder for Indian local shop owners. Customize business name, products, prices, images, colors, and preview live on mobile.',
};

export default function BuilderPage() {
  return <BuilderWizard />;
}
