import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DEMO_SHOPS, getShopBySlug } from '@/data/shops';
import StorefrontClientWrapper from './StorefrontClientWrapper';

export function generateStaticParams() {
  return DEMO_SHOPS.map((shop) => ({
    slug: shop.slug,
  }));
}

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = getShopBySlug(slug);

  if (!shop) {
    return {
      title: 'Shop Not Found — Netrawebai',
    };
  }

  return {
    title: `${shop.name} — ${shop.tagline} | Netrawebai Storefront`,
    description: shop.description,
    openGraph: {
      title: `${shop.name} — Netrawebai Storefront`,
      description: shop.description,
      images: [shop.bannerImage],
    },
  };
}

export default async function ShopDetailPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const shop = getShopBySlug(slug);

  if (!shop) {
    notFound();
  }

  return <StorefrontClientWrapper shop={shop} />;
}
