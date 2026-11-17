import { resolve } from 'node:path';
import { generateApi } from 'swagger-typescript-api';

const METHOD_NAMES = {
  getList: 'getSolutionsList',
  getDraft: 'getSolutionDraft',
  'getFeed[0]': 'getSolutionFeed',
  'getFeed[1]': 'getSolutionFeedById',
  create: 'createSolutionDraft',
  publish: 'publishSolution',
  remove: 'deleteSolution',
  like: 'likeSolution',
  register: 'registerUser',
  login: 'loginUser',
  logout: 'logoutUser',
};

await generateApi({
  fileName: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  url: 'http://localhost:8000/api/docs-json',
  httpClientType: 'axios',
  generateClient: true,
  modular: false,
  moduleNameIndex: 1,
  hooks: {
    onFormatRouteName: (routeInfo, templateRouteName) => {
      const key = String(routeInfo.operationId ?? '').split('_').pop();
      return METHOD_NAMES[key] ?? templateRouteName;
    },
  },
});
