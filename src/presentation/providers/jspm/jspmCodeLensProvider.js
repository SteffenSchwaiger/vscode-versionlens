import appSettings from '../../../appSettings';
import appContrib from '../../../appContrib';
import * as CodeLensFactory from '../../lenses/factories/codeLensFactory';
import { resolvePackageLensData } from '../../../providers/shared/dependencyParser';
import { NpmCodeLensProvider } from '../npm/npmCodeLensProvider';
import { extractJspmLensDataFromText } from './jspmPackageParser';
import { resolveJspmPackage } from './jspmPackageResolver';

export class JspmCodeLensProvider extends NpmCodeLensProvider {

  provideCodeLenses(document, token) {
    if (appSettings.showVersionLenses === false) return [];

    const path = require('path');
    this.packagePath = path.dirname(document.uri.fsPath);

    const packageLensData = extractJspmLensDataFromText(document.getText(), appContrib.npmDependencyProperties);
    if (packageLensData.length === 0) return [];

    const packageLensResolvers = resolvePackageLensData(
      this.packagePath,
      packageLensData,
      resolveJspmPackage
    );
    if (packageLensResolvers.length === 0) return [];

    appSettings.inProgress = true;
    return CodeLensFactory.createCodeLenses(packageLensResolvers, document)
      .then(codelenses => {
        return codelenses;
      });
  }

}