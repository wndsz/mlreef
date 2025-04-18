import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { handleResponse } from 'functions/helpers';
import ApiDirector from './ApiDirector';
import BodyLessApiRequestCallBuilder from './apiBuilders/BLApiRequestCallBuilder';
import { METHODS, validServicesToCall } from './apiBuilders/requestEnums';

export default class BranchesApi extends ApiDirector {
  async create(projectId: number, branchName: string, refBranch: string) {
    const url = `/api/v4/projects/${projectId}/repository/branches`;
    const BLbuilder = new BodyLessApiRequestCallBuilder(
      METHODS.POST, 
      this.buildBasicHeaders(validServicesToCall.GITLAB),
      url
    );
    const params = new Map<string, string>();
    params.set('branch', branchName);
    params.set('ref', refBranch);
    BLbuilder.setUrlParams(params);
    BLbuilder.buildUrlWithParams();
    const response = await fetch(
      BLbuilder.build()
    );
    return response.ok ? response.json() : Promise.reject(response);
  }

  getBranches(projectId: number) {
    const url = `/api/v4/projects/${projectId}/repository/branches`;
    const BLbuilder = new BodyLessApiRequestCallBuilder(
      METHODS.GET, 
      this.buildBasicHeaders(validServicesToCall.GITLAB),
      url
    );
    return fetch(BLbuilder.build())
      .then(handleResponse)
  }

  compare(projectId: number, from: string, to: string) {
    const url = `/api/v4/projects/${projectId}/repository/compare`;
    const BLbuilder = new BodyLessApiRequestCallBuilder(
      METHODS.GET, 
      this.buildBasicHeaders(validServicesToCall.GITLAB), 
      url
    );
    const map = new Map<string, string>();
    map.set('from', from);
    map.set('to', to);
    BLbuilder.setUrlParams(map);
    BLbuilder.buildUrlWithParams();

    return fetch(BLbuilder.build())
      .then(handleResponse);
  }

  async delete(projectId: number, branch: string) {
    const branchName = encodeURIComponent(branch);
    const url = `/api/v4/projects/${projectId}/repository/branches/${branchName}`;
    const BLbuilder = new BodyLessApiRequestCallBuilder(METHODS.DELETE, this.buildBasicHeaders(validServicesToCall.GITLAB), url);

    return fetch(BLbuilder.build())
      .then((res) => res.ok ? res : Promise.reject(res));
  }
}
