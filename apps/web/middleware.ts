import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from './lib/auth/currentUser'


// Define public paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/callback',
]

const mainPaths = [
    '/',
    '/about',
    '/contact',
    '/terms-of-service',
    '/privacy-policy',
    '/guides',
    '/help',
    '/support',
    '/contact',
]


//Paths that require admin authentication
const adminOnlyPaths = [
    '/manage-users',
    '/manage-products',
]

//Add header security check
function isValideHeader(request: NextRequest): boolean {
    const middlewareHeader = request.headers.get('x-middleware-header')
    if(middlewareHeader && !request.url.includes('/_next/')) {
        return false
    }
    return true
}

function isDownloadPath(pathname: string): boolean {
    return pathname.startsWith('/downloads/')
}

function isAdminPath(pathname: string): boolean {
    return adminOnlyPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    )
}

function isPasswordResetPath(pathname: string): boolean {
    return pathname.startsWith('/password-reset/')
}

function getHostname(request: NextRequest): string {
  let hostname = request.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_APP_URL}`)

    if(hostname.includes("---") && 
        hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
        hostname = `${hostname.split("---")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    }

    return hostname
}

function isCustomDomain(hostname: string): boolean {
    return !hostname.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
        hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
        hostname !== process.env.NEXT_PUBLIC_APP_URL &&
        hostname !== 'localhost:3000';
}

export async function middleware(request: NextRequest) {

    //Add security check at the start of middleware
    if(!isValideHeader(request)) {
        return new NextResponse('Bad Request', { status: 400 })
    }

    const { pathname } = request.nextUrl
    const hostname = getHostname(request)
    if(isCustomDomain(hostname)) {
        return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}`, request.url))
    }
    const searchParams = request.nextUrl.searchParams.toString();
    const path = `${pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
    }`;
    //check if it is subdomain or not
    const isSubdomain = hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN && 
                        hostname !== process.env.NEXT_PUBLIC_APP_URL &&
                        hostname !== 'localhost:3000'
    //Handle subdomain requests                   
    if(isSubdomain) {
        //For subdomains, redirect to the correct URL
        return NextResponse.rewrite(new URL(`/sites/${hostname}${path}`, request.url))
    }

    
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};