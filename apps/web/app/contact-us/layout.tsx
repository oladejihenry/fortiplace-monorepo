import HomeHeader from "@/components/homepage/header"
import HomeFooter from "@/components/homepage/footer"

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HomeHeader />
      {children}
      <HomeFooter />
    </>
  )
}