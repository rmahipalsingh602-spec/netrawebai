'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shop, Product } from '@/types';
import { 
  ShoppingBasket, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Search,
  ShoppingCart
} from 'lucide-react';

interface Props {
  shop: Shop;
}

export default function KiranaStorefront({ shop }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [showBasketDrawer, setShowBasketDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Oils & Ghee', 'Atta & Flours', 'Rice & Grains', 'Spices & Masalas', 'Dry Fruits'];

  const addToBasket = (productId: string) => {
    setBasket((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromBasket = (productId: string) => {
    setBasket((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const totalItemsCount = Object.values(basket).reduce((a, b) => a + b, 0);

  const calculateTotalAmount = () => {
    return Object.entries(basket).reduce((total, [productId, qty]) => {
      const prod = shop.products.find((p) => p.id === productId);
      return total + (prod ? prod.price * qty : 0);
    }, 0);
  };

  const filteredProducts = shop.products.filter((p) => {
    const matchesCat = selectedCategory === 'All' ? true : p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getWhatsAppBasketOrderLink = () => {
    const itemsList = Object.entries(basket)
      .map(([id, qty]) => {
        const prod = shop.products.find((p) => p.id === id);
        return prod ? `• ${prod.name} (${prod.unit || '1 unit'}) x ${qty} = ₹${prod.price * qty}` : '';
      })
      .filter(Boolean)
      .join('\n');

    const total = calculateTotalAmount();
    const text = `Hello Lakhmi Kirana! I would like to place this grocery order for delivery:

${itemsList}

Total Order Amount: ₹${total}
Please deliver to my address in Jodhpur. Please confirm availability!`;

    return `https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#F8FAF9] text-stone-900 min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Delivery Notice Bar */}
      <div className="bg-[#064E3B] text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Free 30-Minute Home Delivery on Orders Over ₹499 in Jodhpur</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Jalori Gate Circle, Jodhpur</span>
            </span>
            <a href={`tel:${shop.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{shop.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[45px] z-40 bg-[#F8FAF9]/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#065F46] flex items-center justify-center text-white shadow-md">
              <ShoppingBasket className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#064E3B]">{shop.name}</h1>
              <p className="text-[11px] text-emerald-700 font-semibold">{shop.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBasketDrawer(true)}
              className="relative px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Basket ({totalItemsCount})</span>
              {totalItemsCount > 0 && (
                <span className="bg-emerald-300 text-stone-900 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                  ₹{calculateTotalAmount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Daily Essentials Section */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-[#E6F4EA] via-[#F8FAF9] to-[#F8FAF9] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>30 Years of Pure Grocery Trust • Unadulterated Shudh Quality</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#064E3B] tracking-tight leading-tight">
                {shop.heroHeadline}
              </h2>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-xl">
                {shop.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#groceries"
                  className="px-6 py-3 rounded-xl bg-[#065F46] hover:bg-[#064E3B] text-white font-bold text-xs shadow-lg transition-all"
                >
                  Shop Essentials
                </a>
                <a
                  href={`https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent("Hello Lakhmi Kirana! I would like to send my monthly grocery list on WhatsApp.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] font-bold text-xs border border-emerald-300 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Send Hand-Written List Photo</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-200 text-xs">
                <div>
                  <div className="text-emerald-900 font-bold text-sm">100% Shudh</div>
                  <div className="text-stone-500 text-[11px]">Unadulterated Ghee & Atta</div>
                </div>
                <div>
                  <div className="text-emerald-900 font-bold text-sm">Wholesale Rate</div>
                  <div className="text-stone-500 text-[11px]">Save up to 15% on monthly ration</div>
                </div>
                <div>
                  <div className="text-emerald-900 font-bold text-sm">Fast Drop</div>
                  <div className="text-stone-500 text-[11px]">30 mins delivery at your door</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh Kirana Store"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                    Jalori Gate Store
                  </span>
                  <div className="text-xl font-bold mt-1">Lakhmi Kirana Store</div>
                  <div className="text-xs text-emerald-200">Open 7:30 AM to 10:00 PM Daily</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Groceries Catalog */}
      <section id="groceries" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-emerald-100">
          <div>
            <h3 className="text-2xl font-bold text-[#064E3B]">Kitchen Essentials & Ration</h3>
            <p className="text-xs text-stone-500 mt-0.5">Add items to your basket and send your complete list on WhatsApp.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-[#065F46] text-white shadow'
                    : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/80'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const countInBasket = basket[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 bg-emerald-50 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#065F46] text-white text-[10px] font-bold shadow">
                        {item.badge}
                      </div>
                    )}
                    {item.unit && (
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-semibold backdrop-blur-md">
                        {item.unit}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-emerald-950">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-[#064E3B] leading-snug">
                      {item.name}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Add to Basket Action */}
                <div className="p-5 pt-0 border-t border-emerald-50 mt-3 flex items-center justify-between">
                  {countInBasket > 0 ? (
                    <div className="flex items-center justify-between w-full bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="w-8 h-8 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-sm text-[#064E3B]">
                        {countInBasket} in Basket
                      </span>
                      <button
                        onClick={() => addToBasket(item.id)}
                        className="w-8 h-8 rounded-lg bg-[#065F46] text-white font-bold flex items-center justify-center hover:bg-[#064E3B] shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToBasket(item.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 hover:bg-[#065F46] text-[#064E3B] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Basket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Floating Grocery Basket Bar when items are selected */}
      {totalItemsCount > 0 && !showBasketDrawer && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
          <div className="bg-[#064E3B] text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-emerald-400/40">
            <div>
              <div className="text-xs text-emerald-200 font-medium">{totalItemsCount} items selected</div>
              <div className="text-lg font-black text-white">₹{calculateTotalAmount()}</div>
            </div>
            <button
              onClick={() => setShowBasketDrawer(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-[#064E3B] hover:bg-emerald-50 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View Basket & Order</span>
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      )}

      {/* Basket Drawer Modal */}
      {showBasketDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-stone-900 border border-emerald-200">
            <button
              onClick={() => setShowBasketDrawer(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 text-lg font-bold"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-100">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#064E3B]">
                <ShoppingBasket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#064E3B]">Your Grocery Basket</h4>
                <p className="text-xs text-stone-500">Lakhmi Kirana Shop, Jodhpur</p>
              </div>
            </div>

            {totalItemsCount === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                Your basket is empty. Add items from the shelf!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {Object.entries(basket).map(([id, qty]) => {
                    const item = shop.products.find((p) => p.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <div>
                          <div className="font-bold text-stone-900">{item.name}</div>
                          <div className="text-stone-500 text-[11px]">₹{item.price} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromBasket(id)}
                            className="w-6 h-6 rounded bg-white border border-stone-300 font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-bold">{qty}</span>
                          <button
                            onClick={() => addToBasket(id)}
                            className="w-6 h-6 rounded bg-[#065F46] text-white font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                          <span className="font-bold text-emerald-900 ml-2">₹{item.price * qty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-700">Total Order Amount</span>
                  <span className="text-xl font-black text-[#064E3B]">₹{calculateTotalAmount()}</span>
                </div>

                <a
                  href={getWhatsAppBasketOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5C] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all mt-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Grocery List via WhatsApp</span>
                </a>

                <p className="text-[10px] text-stone-500 text-center">
                  Shop owner will pack your items and send confirmation with delivery time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#064E3B] text-emerald-100 py-12 px-4 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-white font-bold text-sm mb-3">{shop.name}</h5>
            <p className="leading-relaxed text-emerald-200/80">{shop.description}</p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Shop Address</h5>
            <div className="space-y-1.5 text-emerald-200/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{shop.contact.address}, {shop.contact.city} - {shop.contact.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{shop.contact.openingHours}</span>
              </p>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Home Delivery Help</h5>
            <div className="space-y-2 text-emerald-200/80">
              <p>Phone: {shop.contact.phone}</p>
              <p>WhatsApp: +{shop.contact.whatsapp}</p>
              <p className="text-emerald-300 font-semibold">Free delivery above ₹499 in Jodhpur city</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
