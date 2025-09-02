import { SiteFooter } from '@/components/sites/site-footer'
import { SiteNavigation } from '@/components/sites/site-navigation'
import { getSiteByDomain } from '@/lib/fetchers'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { GoogleTagManager } from '@next/third-parties/google'

type Props = {
  params: Promise<{
    domain: string
  }>
  children: ReactNode
}

export async function generateMetadata({ params }: Props) {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const site = await getSiteByDomain(decodedDomain)

  if (site.error) {
    notFound()
  }

  const capitalizedName =
    site.store.store_name.charAt(0).toUpperCase() + site.store.store_name.slice(1)

  return {
    title: capitalizedName,
    twitter: {
      card: 'summary_large_image',
      title: capitalizedName,
      description: site.store.description || 'Fortiplace Store',
      images: ['/fortiplace_twitter.png'],
    },
    openGraph: {
      title: capitalizedName,
      description: site.store.description || 'Fortiplace Store',
      url: `https://${decodedDomain}`,
      images: ['/fortiplace_fb.png'],
    },
  }
}

export default async function SiteLayout({ params, children }: Props) {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const data = await getSiteByDomain(decodedDomain)

  const googleTag = data.store?.integration?.googleTag
  const twitterUsername = data.store?.integration?.twitterUsername
  const facebookUsername = data.store?.integration?.facebookUsername

  if (data.error) {
    notFound()
  }

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="dark:bg-background flex min-h-screen flex-col">
        <div className="dark:bg-background sticky top-0 z-10">
          <SiteNavigation domain={domain} storeName={data.store?.store_name} />
        </div>
        <main className="container mx-auto max-w-7xl flex-grow px-4">
          {children}
          {googleTag && <GoogleTagManager gtmId={googleTag} />}
        </main>
        <SiteFooter
          twitterUsername={twitterUsername}
          facebookUsername={facebookUsername}
          storeName={data.store?.store_name}
        />
      </div>
    </>
  )
}
