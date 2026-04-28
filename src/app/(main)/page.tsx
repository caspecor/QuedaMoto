import HomeClient from './HomeClient'
import { getActiveBanners, getBannerModuleStatus } from "@/app/admin/banners/actions"

export default async function HomePage() {
  // Fetch settings in parallel
  const [middleEnabled, footerEnabled] = await Promise.all([
    getBannerModuleStatus('home_middle'),
    getBannerModuleStatus('home_footer')
  ])

  // Fetch banners only if enabled
  const [middleBanners, footerBanners] = await Promise.all([
    middleEnabled ? getActiveBanners('home_middle') : [],
    footerEnabled ? getActiveBanners('home_footer') : []
  ])

  return (
    <HomeClient 
      middleEnabled={middleEnabled}
      footerEnabled={footerEnabled}
      initialMiddleBanners={middleBanners}
      initialFooterBanners={footerBanners}
    />
  )
}
