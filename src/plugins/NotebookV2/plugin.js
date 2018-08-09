/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

 define([
    "./src/controllers/NotebookController",
    "./src/actions/snapshotAction"
 ], function (
    NotebookController,
    snapshotAction
 ) {
    var installed  = false;

    function NotebookV2Plugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }

            installed = true;

            openmct.legacyRegistry.register('notebookV2', {
                name: 'Notebook Plugin',
                extensions: {
                    types: [
                        {
                            key: 'notebookV2',
                            name: 'NotebookV2',
                            cssClass: 'icon-notebook',
                            description: 'Create and save timestamped notes with embedded object snapshots.',
                            features: 'creation',
                            model: {
                                entries: [],
                                composition: [],
                                entryTypes: [],
                                defaultSort: '-createdOn'
                            },
                            properties: [
                                {
                                    key: 'defaultSort',
                                    name: 'Default Sort',
                                    control: 'select',
                                    options: [
                                        {
                                            name: 'Newest First',
                                            value: "-createdOn",
                                        },
                                        {
                                            name: 'Oldest First',
                                            value: "createdOn"
                                        }
                                    ],
                                    cssClass: 'l-inline'
                                }
                            ]
                        }
                    ],
                    actions: [
                        {
                            key: "snapShotAction",
                            implementation: snapshotAction,
                            name: "Snapshot",
                            description: "Take a snapshot and save as a notebook entry",
                            category: "contextual",
                            depends: [
                                "exportImageService",
                                "dialogService"
                            ]
                        }
                    ]
                }
            });

            openmct.legacyRegistry.enable('notebookV2');

            openmct.objectViews.addProvider({
                key: 'notebook-vue',
                name: 'Notebook View',
                cssClass: 'icon-notebook',
                canView: function (domainObject) {
                    return domainObject.type === 'notebookV2';
                },
                view: function (domainObject) {
                    var controller = new NotebookController (openmct, domainObject);

                    return {
                        show: controller.show,
                        destroy: controller.destroy
                    };
                }
            });
        };

    }

    return NotebookV2Plugin;
 });