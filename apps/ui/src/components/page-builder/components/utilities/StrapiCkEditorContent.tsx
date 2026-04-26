import type { Data } from "@repo/strapi-types"

import CKEditorRenderer from "@/components/elementary/ck-editor"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"

export function StrapiCkEditorContent({
  component,
}: {
  readonly component: Data.Component<"utilities.ck-editor-content">
}) {
  return (
    <div className="mx-auto w-full max-w-[1296px] px-6 py-8 lg:py-12">
      <CKEditorRenderer htmlContent={component.content} />
      {component.link && (
        <div className="mt-6 flex justify-center">
          <StrapiLink component={component.link} variant="primary" />
        </div>
      )}
    </div>
  )
}

StrapiCkEditorContent.displayName = "CkEditorContent"

export default StrapiCkEditorContent
