"use client"

import type { Data } from "@repo/strapi-types"
import { useEffect, useRef, useState } from "react"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

// Helper component to render media (image or video)
function MediaBackground({
  carousel,
}: {
  carousel: Data.Component<"utilities.media-with-texts-and-buttons">
}) {
  const media = carousel?.media
  const isVideo = media?.mime?.startsWith("video/")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // 获取视频封面图（如果有的话使用 preview 图片）
  const posterUrl = media?.previewUrl
    ? formatStrapiMediaUrl(media.previewUrl)
    : undefined

  useEffect(() => {
    if (!isVideo || !videoRef.current) {
      return
    }

    const video = videoRef.current

    // 微信浏览器兼容性属性
    video.setAttribute("webkit-playsinline", "true")
    video.setAttribute("x5-playsinline", "true")
    video.setAttribute("x5-video-player-type", "h5")
    video.setAttribute("x5-video-player-fullscreen", "false")

    const tryPlay = () => {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Ignore autoplay restrictions
        })
      }
    }

    const onWeixinReady = () => tryPlay()
    const onTouchStart = () => {
      tryPlay()
      document.removeEventListener("touchstart", onTouchStart)
    }

    document.addEventListener("WeixinJSBridgeReady", onWeixinReady, false)
    document.addEventListener("YixinJSBridgeReady", onWeixinReady, false)
    document.addEventListener("touchstart", onTouchStart, {
      passive: true,
    })

    return () => {
      document.removeEventListener("WeixinJSBridgeReady", onWeixinReady)
      document.removeEventListener("YixinJSBridgeReady", onWeixinReady)
      document.removeEventListener("touchstart", onTouchStart)
    }
  }, [isVideo])

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        preload="auto"
        src={formatStrapiMediaUrl(media.url)}
      />
    )
  }

  return (
    <StrapiBasicImage
      component={carousel}
      className="h-full w-full overflow-hidden object-cover"
      sizes="100vw"
      quality={85}
      fill
      priority
      loading="eager"
    />
  )
}

export function StrapiHeroCarousel({
  component,
}: {
  readonly component: Data.Component<"sections.hero-carousel">
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)

    // Clean up event listener
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (!component.carousels || component.carousels.length === 0) {
    return null
  }

  return (
    <Section className="flex flex-col items-center gap-4 pt-0 md:pt-0 lg:gap-12">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent className="ml-0 will-change-transform">
          {component.carousels.map((carousel) => (
            <CarouselItem key={carousel.id} className="relative pl-0">
              <div className="bg-primary-700 relative h-[80vh] w-full overflow-hidden lg:h-200">
                {/* Background Media (Image or Video) */}
                {carousel && <MediaBackground carousel={carousel} />}

                {/* Gradient Overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(240deg, rgba(255, 255, 255, 0) 0%, rgba(30, 30, 30, 0.75) 75%)",
                  }}
                />

                {/* Content Overlay */}
                <div className="absolute bottom-48 flex w-full items-center justify-center">
                  <Container>
                    <div className="flex flex-col items-start gap-10">
                      <div className="flex flex-col items-start gap-4">
                        {carousel.title && (
                          <div className="text-3xl font-thin whitespace-pre-wrap text-white lg:text-7xl [&>*:nth-child(2)]:font-bold">
                            {carousel.title
                              .split("\n")
                              .map((line, lineIndex) => (
                                <div key={lineIndex}>{line}</div>
                              ))}
                          </div>
                        )}
                        {carousel.description && (
                          <p className="text-sm whitespace-pre-wrap text-white lg:text-lg">
                            {carousel.description}
                          </p>
                        )}
                      </div>

                      {(carousel.buttons ?? []).length > 0 && (
                        <div className="flex justify-start gap-4">
                          {(carousel.buttons ?? []).map((button, index) => (
                            <div
                              className="flex justify-center"
                              key={button.id || index}
                            >
                              <StrapiLink
                                component={button}
                                variant="primary"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Container>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicator Lines */}
      <div className="flex w-full max-w-3/4 gap-0 lg:max-w-96">
        {component.carousels.map((carousel, carouselIndex) => (
          <div
            key={carousel.id}
            role="button"
            tabIndex={0}
            onClick={() => api?.scrollTo(carouselIndex)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                api?.scrollTo(carouselIndex)
              }
            }}
            className={cn(
              "relative h-1 flex-1 transition-colors duration-300",
              current === carouselIndex
                ? "bg-primary-700"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`跳转到第 ${carouselIndex + 1} 个轮播`}
          >
            <div className="absolute bottom-0 left-0 h-12 w-full" />
          </div>
        ))}
      </div>
    </Section>
  )
}

StrapiHeroCarousel.displayName = "StrapiHeroCarousel"

export default StrapiHeroCarousel
