import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { ExamplePosts } from "@/components/example-posts"
import { PublicFeed } from "@/components/public-feed"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PageTransition } from "@/components/page-transition"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { InteractPromo } from "@/components/interact-promo"
import { UserSearch } from "@/components/user-search"
export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen relative overflow-hidden">
        <Navbar />
        <HeroSection />
        <Features />
        <HowItWorks />
        <ExamplePosts />
        <InteractPromo />
        <UserSearch
          placeholder="Search for users by name or username..."
          buttonText="Find Users"
          className="container mx-auto px-4 py-8"
        />
        {/* Public Feed Section */}
        <section className="py-20 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="text-gradient">Explore Public Posts</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
              Discover historical social media posts created by our community
            </p>

            <Suspense fallback={<LoadingSkeleton />}>
              <PublicFeed />
            </Suspense>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </main>
    </PageTransition>
  )
}
