const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const config = getDefaultConfig(projectRoot)

config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]
config.resolver.disableHierarchicalLookup = true
config.watchFolders = [path.resolve(workspaceRoot, 'packages/shared')]
config.resolver.extraNodeModules = {
  '@betterbudget/shared': path.resolve(workspaceRoot, 'packages/shared/src/index.ts'),
}

module.exports = withNativeWind(config, { input: './global.css' })
