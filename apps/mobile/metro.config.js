const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch the shared package
config.watchFolders = [workspaceRoot]

// Resolve from workspace root first (handles hoisted packages)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Resolve @betterbudget/shared to source
config.resolver.extraNodeModules = {
  '@betterbudget/shared': path.resolve(workspaceRoot, 'packages/shared/src/index.ts'),
}

module.exports = withNativeWind(config, { input: './global.css' })
