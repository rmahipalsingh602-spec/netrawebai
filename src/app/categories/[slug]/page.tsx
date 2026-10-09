import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CATEGORIES, getCategoryById } from '@/data/categories';
import { DEMO_SHOPS } from '@/data/shops';
import { TEMPLATES } from '@/data/templates';
import { 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Wand2, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Store,
  Layers,
  Palette
} from 'lucide-react';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.id,
  }));
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryById(slug);

  if (!category) {
    notFound();
  }

  // Find demo shops in this category
  const matchingShops = DEMO_SHOPS.filter((s) => s.categorySlug === category.id);
  // If no direct shop, show a fallback demo shop so the user always has a realistic example
  const displayShops = matchingShops.length > 0 ? matchingShops : [DEMO_SHOPS[0]];

  // Find matching templates
  const matchingTemplates = TEMPLATES.filter((t) => t.categorySlug === category.id);
  const displayTemplates = matchingTemplates.length > 0 ? matchingTemplates : TEMPLATES.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        {/* Category Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-[#0F1A38] to-[#0B132B] border-b border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <Link href="/categories" className="text-xs text-blue-400 hover:underline">
                    &larr; All Categories
                  </Link>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">{category.hindiName}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Website Designs for{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                    {category.name}
                  </span>
                </h1>

                <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                  {category.description} Launch your custom {category.name.toLowerCase()} website with built-in product showcase, mobile ordering, and instant WhatsApp inquiry.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-blue-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/builder?category=${category.id}`}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Create My {category.name} Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Category Visual Banner */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-slate-900/90 px-2.5 py-1 rounded">
                      Tailored Industry Design
                    </span>
                    <div className="text-white font-bold text-lg mt-1">{category.name} Edition</div>
                    <div className="text-xs text-slate-300">{category.templateCount} Responsive Layouts Available</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Demo Storefronts in this Category */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white">
              Demonstration {category.name} Websites
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore working live demos built on this category layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayShops.map((shop) => (
              <div
                key={shop.id}
                className="group bg-[#121A36] rounded-2xl border border-slate-800 hover:border-blue-500/40 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={shop.bannerImage}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A36] via-[#121A36]/40 to-transparent" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-bold text-blue-400 border border-slate-800">
                      {shop.category}
                    </div>
                    {shop.rating && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-medium">{shop.tagline}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{shop.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shop.contact.address}, {shop.contact.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center gap-2.5">
                  <Link
                    href={`/shop/${shop.slug}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/builder?shop=${shop.slug}&category=${category.id}&template=${shop.templateId}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Customize</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Template Gallery for this Category */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white">
              Available Design Templates for {category.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any design preset to start customizing with your shop logo, colors, and items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-[#121A36] rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 relative">
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                      {template.styleName}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mt-3">{template.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{template.description}</p>
                </div>

                <Link
                  href={`/builder?template=${template.id}&category=${category.id}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Build with This Template</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
