/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {Dao} from './dao.js';
import { MainTemplate } from './mainTemplate.js';
import { ExportReadings } from './exportReadings.js';
import { dataImportedAlertTemplate } from './htmlTemplates.js';
import { EXPORT } from './export.js' // TODO

import '../www/libs/jquery.min.js';

'cordova' in window ? document.addEventListener("deviceready", init, false) : init();

function init() {

  const dao = new Dao();

  /* Workarround: Checking android filesystem permissions

  For some reason, cordova file plugin returns an error of file permissions
  when first action is deleting a file, though user has granted write permissions to the app. 
  If first action is writing a file, there are no problems with permissions. 
  Since that moment it's possible delete files as well.
  */
  window.resolveLocalFileSystemURL(dao.dataDirectory, function(dir) {
    dir.getFile("check_write_permissions", {create:true}, function(fileEntry) {
      fileEntry.remove();
    }, function(error) {console.log("Error: " + error.code) })
  })

  window.resolveLocalFileSystemURL(dao.dataDirectory, function(dir) {
    dir.getFile(dao.importFileName, {create:false}, fileExists, fileNotExists );
  });

  function fileExists() {
    dao.getDataFromFile().then(function(result){
      loadUsersList(result);
      document.getElementById("alertsZone").innerHTML = dataImportedAlertTemplate;
    });
  }

  function fileNotExists() {
    dao.getData().then(function(result) {
      loadUsersList(result);
    })
  }

  function loadUsersList(result) {
    const users = JSON.parse(result);  
    const mainTemplate = new MainTemplate("Recorrido", "Todos", users);
    const usersList = document.getElementById(mainTemplate.getUsersListElement());
    mainTemplate.fillUsersList(usersList);
    mainTemplate.setListeners();

    const exportReadings = new ExportReadings();
    exportReadings.setListeners();
  }

  setTimeout(()=> { // TODO
    loadUsersList(JSON.stringify(EXPORT))
  }, 5000)

}