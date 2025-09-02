import { SidebarAvatar } from "@/components/sidebar-avatar"
import { getSiteUserByDomain } from "@/lib/fetchers"
import { Mail, Phone } from "lucide-react"

type Props = {
  params: Promise<{
    domain: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const siteUser = await getSiteUserByDomain(decodedDomain)

  const capitalizedName =
    siteUser?.user?.username?.charAt(0).toUpperCase() +
    siteUser?.user?.username?.slice(1)

  return {
    title: `${capitalizedName}`,
    description: siteUser?.user?.description,
    openGraph: {
      title: `${capitalizedName}`,
      description: siteUser?.user?.description,
      images: [siteUser?.user?.google_avatar || siteUser?.user?.twitter_avatar],
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedName}`,
      description: siteUser?.user?.description,
      images: [siteUser?.user?.google_avatar || siteUser?.user?.twitter_avatar],
    },
  }
}

export default async function SiteAboutPage({ params }: Props) {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const siteUser = await getSiteUserByDomain(decodedDomain)

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex flex-col items-center gap-6">
        <SidebarAvatar
          username={siteUser?.user?.username}
          googleAvatar={siteUser?.user?.google_avatar}
          twitterAvatar={siteUser?.user?.twitter_avatar}
          className="w-32 h-32 shadow-lg border-4 border-background bg-white"
        />
        <h2 className="text-3xl font-extrabold capitalize text-center tracking-tight">
          {siteUser?.user?.store_name}
        </h2>
        {siteUser?.user?.description && (
          <p className="text-muted-foreground text-center text-lg max-w-xl">
            {siteUser?.user?.description}
          </p>
        )}
        {(siteUser?.user?.store_phone_number || siteUser?.user?.phone_number) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="font-medium">Store Phone Number:</span>
            <span>{siteUser?.user?.store_phone_number || siteUser?.user?.phone_number}</span>
          </div>
        )}
         {(siteUser?.user?.store_email || siteUser?.user?.email) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="font-medium">Store Email:</span>
            <span>{siteUser?.user?.store_email || siteUser?.user?.email}</span>
          </div>
        )}
      </div>
    </div>
  )
}