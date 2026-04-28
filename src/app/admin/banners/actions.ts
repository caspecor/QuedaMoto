'use server'

import { db } from "@/db"
import { banners, settings } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'admin' && session.user.email !== 'admin@quedamoto.com')) {
    throw new Error("No autorizado")
  }
}

export async function getBanners() {
  await checkAdmin()
  const data = await db.select().from(banners).orderBy(desc(banners.createdAt))
  return data
}

export async function getActiveBanners(position: string) {
  const data = await db.select()
    .from(banners)
    .where(eq(banners.position, position))
    .orderBy(banners.slotIndex, desc(banners.createdAt))
  
  return data.filter(b => b.isActive)
}

export async function createBanner(data: {
  title: string;
  badgeText?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  slotIndex: number;
}) {
  try {
    await checkAdmin()
    await db.insert(banners).values({
      title: data.title,
      badgeText: data.badgeText || 'Sponsor',
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl || '',
      position: data.position,
      slotIndex: data.slotIndex,
      isActive: true,
      order: 0,
      clicks: 0,
    })
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { error: error.message || "Error al crear banner" }
  }
}

export async function updateBanner(id: string, data: {
  title: string;
  badgeText?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
  slotIndex: number;
}) {
  try {
    await checkAdmin()
    
    const updateData: any = {
      title: data.title,
      badgeText: data.badgeText || 'Sponsor',
      linkUrl: data.linkUrl || '',
      position: data.position,
      slotIndex: data.slotIndex,
    }
    
    if (data.imageUrl) {
      updateData.imageUrl = data.imageUrl
    }
    
    await db.update(banners)
      .set(updateData)
      .where(eq(banners.id, id))
      
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { error: error.message || "Error al actualizar banner" }
  }
}

export async function deleteBanner(id: string) {
  try {
    await checkAdmin()
    await db.delete(banners).where(eq(banners.id, id))
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Error al eliminar" }
  }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  try {
    await checkAdmin()
    await db.update(banners)
      .set({ isActive: !currentStatus })
      .where(eq(banners.id, id))
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Error al actualizar estado" }
  }
}

export async function incrementBannerClick(id: string) {
  try {
    const b = await db.select().from(banners).where(eq(banners.id, id)).limit(1)
    if (b.length > 0) {
      await db.update(banners)
        .set({ clicks: (b[0].clicks || 0) + 1 })
        .where(eq(banners.id, id))
    }
    return { success: true }
  } catch (error) {
    return { error: "Failed to increment clicks" }
  }
}

export async function getBannerModuleStatus(position: string) {
  const key = `banner_${position}_enabled`
  const data = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
  if (data.length === 0) return true // Default is enabled
  return data[0].value === 'true'
}

export async function getAllBannerModulesStatus() {
  await checkAdmin()
  const middle = await getBannerModuleStatus('home_middle')
  const middle2 = await getBannerModuleStatus('home_middle_2')
  const footer = await getBannerModuleStatus('home_footer')
  return { home_middle: middle, home_middle_2: middle2, home_footer: footer }
}

export async function toggleBannerModule(position: string, enabled: boolean) {
  try {
    await checkAdmin()
    const key = `banner_${position}_enabled`
    const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
    
    if (existing.length === 0) {
      await db.insert(settings).values({ key, value: enabled ? 'true' : 'false' })
    } else {
      await db.update(settings).set({ value: enabled ? 'true' : 'false' }).where(eq(settings.key, key))
    }
    
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Error al cambiar estado del módulo" }
  }
}
