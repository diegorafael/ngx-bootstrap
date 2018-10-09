/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';

describe('ng-add schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  // beforeEach(() => {
  //   runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
  //   appTree = createTestApp(runner);
  // });

  /** Expects the given file to be in the styles of the specified workspace project. */
  // function expectProjectStyleFile(project: WorkspaceProject, filePath: string) {
  //   expect(getProjectTargetOptions(project, 'build').styles).toContain(filePath,
  //     `Expected "${filePath}" to be added to the project styles in the workspace.`);
  // }

  /** Removes the specified dependency from the /package.json in the given tree. */
  function removePackageJsonDependency(tree: Tree, dependencyName: string) {
    const packageContent = JSON.parse(getFileContent(tree, '/package.json'));
    delete packageContent.dependencies[dependencyName];
    tree.overwrite('/package.json', JSON.stringify(packageContent, null, 2));
  }

  it('should update package.json', () => {
    removePackageJsonDependency(appTree, 'bootstrap');

    const tree = runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies = packageJson.dependencies;

    /* tslint:disable-next-line: no-string-literal */
    expect(dependencies['bootstrap']).toBeDefined();

    expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort(),
      'Expected the modified "dependencies" to be sorted alphabetically.');

    expect(runner.tasks.some(task => task.name === 'run-schematic')).toBe(true);
  });

  // it('should add default theme', () => {
  //   const tree = runner.runSchematic('ng-add-setup-project', {}, appTree);
  //
  //   const workspace = getWorkspace(tree);
  //   const project = getProjectFromWorkspace(workspace);
  //
  //   expectProjectStyleFile(project,
  //     './node_modules/@angular/material/prebuilt-themes/indigo-pink.css');
  // });
  //
  // it('should create a custom theme file if no SCSS file could be found', () => {
  //   // TODO(devversion): do not re-create test app here.
  //   appTree = createTestApp(runner, {style: 'css'});
  //
  //   const tree = runner.runSchematic('ng-add-setup-project', {theme: 'custom'}, appTree);
  //   const workspace = getWorkspace(tree);
  //   const project = getProjectFromWorkspace(workspace);
  //   const expectedStylesPath = normalize(`/${project.root}/src/custom-theme.scss`);
  //
  //   expect(tree.files).toContain(expectedStylesPath, 'Expected a custom theme file to be created');
  //   expectProjectStyleFile(project, 'projects/material/src/custom-theme.scss');
  // });
});
