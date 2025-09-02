import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'

export default function HomeFeaturedProducts() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold">Featured Products from Our Sellers</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="from-primary/10 overflow-hidden rounded-lg border bg-gradient-to-br to-transparent shadow-sm">
            <div className="bg-background relative aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Product thumbnail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Advanced Photoshop Techniques</h3>
              <p className="mb-4 text-sm text-gray-600">
                Master the art of photo manipulation with this comprehensive course.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#34D399]">$79.99</span>
                <Button
                  variant="outline"
                  className="border-[#34D399] text-[#34D399] hover:bg-[#34D399] hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="from-primary/10 overflow-hidden rounded-lg border bg-gradient-to-br to-transparent shadow-sm">
            <div className="bg-background relative aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Product thumbnail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Ultimate Web Development Bundle</h3>
              <p className="mb-4 text-sm text-gray-600">
                From beginner to pro: A complete guide to modern web development.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#34D399]">$129.99</span>
                <Button
                  variant="outline"
                  className="border-[#34D399] text-[#34D399] hover:bg-[#34D399] hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="from-primary/10 overflow-hidden rounded-lg border bg-gradient-to-br to-transparent shadow-sm">
            <div className="bg-background relative aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Product thumbnail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Financial Freedom Blueprint</h3>
              <p className="mb-4 text-sm text-gray-600">
                Achieve your financial goals with this step-by-step ebook and course.
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#34D399]">$49.99</span>
                <Button
                  variant="outline"
                  className="border-[#34D399] text-[#34D399] hover:bg-[#34D399] hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button className="bg-[#34D399] text-white hover:bg-[#34D399]/90">
            Explore All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
