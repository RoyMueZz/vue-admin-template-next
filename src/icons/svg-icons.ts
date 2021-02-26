import camelCase from 'xe-utils/camelCase'

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys()

const re = /\.\/(.*)\.svg/

interface SvgIcons {
  [key: string]: string;
}
const svgIcons: SvgIcons = {}


requireAll(req).forEach(i => {
  svgIcons[camelCase(i.match(re)[1])] = i.match(re)[1]
})


export default svgIcons
