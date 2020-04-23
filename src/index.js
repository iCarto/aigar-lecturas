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

import '../www/libs/jquery.min.js';

'cordova' in window ? document.addEventListener("deviceready", init, false) : init();

function init() {

  const dao = new Dao();
  const promise = dao.getData();

  promise.then(function() {
    const users = JSON.parse(window.localStorage.getItem('dataJson'));  
    const mainTemplate = new MainTemplate("Recorrido", "Todos", users);
    const usersList = document.getElementById(mainTemplate.getUsersListElement());
    mainTemplate.fillUsersList(usersList);
    mainTemplate.setListeners();

    const exportReadings = new ExportReadings();
    exportReadings.setListeners();
  })
  .catch(error => console.log(error));
}