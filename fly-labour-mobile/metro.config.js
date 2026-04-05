const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Zustand ESM build (.mjs) dùng import.meta.env — Metro web không hỗ trợ.
// Redirect tất cả zustand imports sang CJS build khi build cho web.
const ZUSTAND_CJS = {
  'zustand':            path.resolve(__dirname, 'node_modules/zustand/index.js'),
  'zustand/vanilla':    path.resolve(__dirname, 'node_modules/zustand/vanilla.js'),
  'zustand/middleware': path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
  'zustand/shallow':    path.resolve(__dirname, 'node_modules/zustand/shallow.js'),
  'zustand/react':      path.resolve(__dirname, 'node_modules/zustand/react.js'),
  'zustand/traditional':path.resolve(__dirname, 'node_modules/zustand/traditional.js'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && ZUSTAND_CJS[moduleName]) {
    return { filePath: ZUSTAND_CJS[moduleName], type: 'sourceFile' }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './global.css' })
