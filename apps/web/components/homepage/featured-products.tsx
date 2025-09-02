import Image from "next/image";
import { Button } from "../ui/button";

export default function HomeFeaturedProducts() {
  return (
    <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products from Our Sellers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-transparent border rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-background relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Product thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Advanced Photoshop Techniques</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Master the art of photo manipulation with this comprehensive course.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#34D399] font-bold">$79.99</span>
                  <Button
                    variant="outline"
                    className="text-[#34D399] border-[#34D399] hover:bg-[#34D399] hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-background relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Product thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Ultimate Web Development Bundle</h3>
                <p className="text-gray-600 text-sm mb-4">
                  From beginner to pro: A complete guide to modern web development.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#34D399] font-bold">$129.99</span>
                  <Button
                    variant="outline"
                    className="text-[#34D399] border-[#34D399] hover:bg-[#34D399] hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-background relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Product thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Financial Freedom Blueprint</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Achieve your financial goals with this step-by-step ebook and course.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#34D399] font-bold">$49.99</span>
                  <Button
                    variant="outline"
                    className="text-[#34D399] border-[#34D399] hover:bg-[#34D399] hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button className="bg-[#34D399] text-white hover:bg-[#34D399]/90">Explore All Products</Button>
          </div>
        </div>
      </section>
  );
}