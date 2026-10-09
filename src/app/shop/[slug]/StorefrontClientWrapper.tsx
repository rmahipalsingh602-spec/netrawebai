'use client';

import React, { useState } from 'react';
import { Shop } from '@/types';
import StorefrontBanner from '@/components/storefront/StorefrontBanner';
import MobileStorefront from '@/components/storefront/MobileStorefront';
import RepairStorefront from '@/components/storefront/RepairStorefront';
import ClothingStorefront from '@/components/storefront/ClothingStorefront';
import CafeStorefront from '@/components/storefront/CafeStorefront';
import JewelleryStorefront from '@/components/storefront/JewelleryStorefront';
import KiranaStorefront from '@/components/storefront/KiranaStorefront';
import GenericStorefront from '@/components/storefront/GenericStorefront';

interface Props {
  shop: Shop;
}

export default function StorefrontClientWrapper({ shop }: Props) {
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const renderStorefrontContent = () => {
    switch (shop.slug) {
      case 'mahadev-mobile':
        return <MobileStorefront shop={shop} />;
      case 'royal-mobile-repair':
        return <RepairStorefront shop={shop} />;
      case 'rangilo-clothing':
        return <ClothingStorefront shop={shop} />;
      case 'marwad-cafe':
        return <CafeStorefront shop={shop} />;
      case 'mahadev-jewellery':
        return <JewelleryStorefront shop={shop} />;
      case 'lakhmi-kirana':
        return <KiranaStorefront shop={shop} />;
      default:
        // Also check by categorySlug
        if (shop.categorySlug === 'mobile-shops') return <MobileStorefront shop={shop} />;
        if (shop.categorySlug === 'mobile-repair') return <RepairStorefront shop={shop} />;
        if (shop.categorySlug === 'clothing') return <ClothingStorefront shop={shop} />;
        if (shop.categorySlug === 'cafes' || shop.categorySlug === 'restaurants') return <CafeStorefront shop={shop} />;
        if (shop.categorySlug === 'jewellery') return <JewelleryStorefront shop={shop} />;
        if (shop.categorySlug === 'kirana') return <KiranaStorefront shop={shop} />;
        return <GenericStorefront shop={shop} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] flex flex-col">
      <StorefrontBanner
        shop={shop}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      <div className={`flex-1 ${isMobileFrame ? 'py-8 px-4 flex justify-center bg-[#050811]' : ''}`}>
        {isMobileFrame ? (
          <div className="w-full max-w-[390px] min-h-[780px] bg-black rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden">
            {/* Simulated Phone Notch */}
            <div className="w-32 h-4 bg-black rounded-b-2xl mx-auto mb-2 relative z-50 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
            </div>
            <div className="rounded-[32px] overflow-hidden overflow-y-auto max-h-[720px] no-scrollbar">
              {renderStorefrontContent()}
            </div>
          </div>
        ) : (
          renderStorefrontContent()
        )}
      </div>
    </div>
  );
}
