import path from 'path';
var GitRevisionPlugin = require('git-revision-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);

  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

const webpackPlugin = config => {
  // optimize chunks
  config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module) || '';

            if (packageName) {
              return [
                'bizcharts',
                'gg-editor',
                'g6',
                '@antv',
                'l7',
                'gg-editor-core',
                'bizcharts-plugin-slider',
              ].includes(packageName);
            }

            return false;
          },

          name(module) {
            const packageName = getModulePackageName(module);

            if (packageName) {
              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }

            return 'misc';
          },
        },
      },
    })
    // .minimizer('js').tap(args=>[...args,new UglifyJsPlugin()])//.use()
  ;
  config.merge({
    // optimization:{minimize: true,minimizer:'terserjs'}
  })
  // config.plugin('uglifyjs-webpack-plugin').use(UglifyJsPlugin,);

  config.plugin('git-revision-webpack-plugin').use(GitRevisionPlugin)
};

export default webpackPlugin;
