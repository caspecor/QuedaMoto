import HomeClient from './HomeClient'
import { getActiveBanners, getBannerModuleStatus } from "@/app/admin/banners/actions"

export default async function HomePage() {
  // Fetch settings in parallel
  const [middleEnabled, middle2Enabled, footerEnabled] = await Promise.all([
    getBannerModuleStatus('home_middle'),
    getBannerModuleStatus('home_middle_2'),
    getBannerModuleStatus('home_footer')
  ])

  // Fetch banners only if enabled
  const [middleBanners, middle2Banners, footerBanners] = await Promise.all([
    middleEnabled ? getActiveBanners('home_middle') : [],
    middle2Enabled ? getActiveBanners('home_middle_2') : [],
    footerEnabled ? getActiveBanners('home_footer') : []
  ])

  return (
    <HomeClient 
      middleEnabled={middleEnabled}
      middle2Enabled={middle2Enabled}
      footerEnabled={footerEnabled}
      initialMiddleBanners={middleBanners}
      initialMiddle2Banners={middle2Banners}
      initialFooterBanners={footerBanners}
    />
  )
}
