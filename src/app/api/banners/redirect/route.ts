import { NextResponse } from 'next/server'
import { incrementBannerClick } from '@/app/admin/banners/actions'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const url = searchParams.get('url')

  if (!id || !url) {
    return new NextResponse('Missing parameters', { status: 400 })
  }

  // Increment clicks in the background (don't await so redirect is fast)
  incrementBannerClick(id).catch(console.error)

  // Redirect to the target URL
  return NextResponse.redirect(url)
}
