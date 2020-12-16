import SvgIcon from "@/components/SvgIcon" // svg component
const req = require.context("./svg", false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// 全局注册
export default app => {
  app.component("svg-icon", SvgIcon)
}
