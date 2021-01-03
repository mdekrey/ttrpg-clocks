/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import "./src/style/tailwind.css"

const scrollTo = id => {
  const el = document.getElementById(id.substring(1))
  if (el) el.scrollIntoView()
}
// This is built into the browser, but somehow gatsby breaks it.
window.addEventListener(
  "hashchange",
  () => window.location.hash && scrollTo(window.location.hash)
)

export const shouldUpdateScroll = () => false
