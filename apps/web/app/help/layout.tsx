import HomeHeader from "@/components/homepage/header"
import HomeFooter from "@/components/homepage/footer"

export default function HelpLayout({
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