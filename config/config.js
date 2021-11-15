// https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { winPath } = utils; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

// show version control
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevision = new GitRevisionPlugin();

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV, GA_KEY } = process.env;
export default defineConfig({
  // hash: true,
  antd: {},
  analytics: GA_KEY
    ? {
        ga: GA_KEY,
      }
    : false,
  dva: {
    hmr: true,
  },
  
  locale: {},
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              path: '/self',
              name: 'self',
              icon: 'info-circle',
              // hideInMenu: true,
              routes: [
                
                  // {
                  //   name: 'list.table-list',
                  //   icon: 'table',
                  //   path: '/self/list',
                  //   component: './ListTableList',
                  // },
                  // {
                  //   name: 'echart.chart',
                  //   icon: 'barChart',
                  //   path: '/self/echart',
                  //   component: './Chart',
                  // },
                  // {
                  //   name: 'sql.sql',
                  //   icon: 'database',
                  //   path: '/self/query',
                  //   component: './Query',
                  // },
                  
                  {
                    name: '上传',
                    icon: 'upload',
                    path: '/self/upload',
                    component: './Upload',
                  },
                  {
                    name: 'tif',
                    icon: 'upload',
                    path: '/self/tif',
                    component: './Tif',
                  },
                  {
                    name: 'useContext/useReducer',
                    icon: 'list',
                    path: '/self/hookUseContext',
                    component: './hook',
                  },
                ]
            },
            {
              path: '/word',
              name: '认字',
              icon: 'font-colors',
              // hideInMenu: true,
              routes: [
                
                  {
                    name: '上传pptx',
                    icon: 'upload',
                    path: '/word/upload',
                    component: './Upload/pptx',
                  },
                ]
            },
            
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map(a => a.replace(/([A-Z])/g, '-$1'))
            .map(a => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  // minimizer:'terserjs',

  proxy: proxy[REACT_APP_ENV || 'dev'],

  headScripts:[`var commitHash="commitHash:${(gitRevision.commithash()).slice(0,8)}"`,`var packHashDate="${new Date()}"`],
  chainWebpack: webpackPlugin,
});
