// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directive for visualizing multiple incorrect issue.
 */

require('domain/utilities/url-interpolation.service.ts');
require('services/alerts.service.ts');
require('services/playthrough-issues.service.ts');

angular.module('oppia').directive('multipleIncorrectIssue', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {
        // An integer representing the issue index.
        index: '&',
        // A read-only object representing the issue.
        issue: '&'
      },
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/exploration-editor-page/statistics-tab/issues/' +
        'multiple-incorrect-issue.directive.html'),
      controller: [
        '$scope', '$uibModal', 'AlertsService', 'PlaythroughIssuesService',
        function($scope, $uibModal, AlertsService, PlaythroughIssuesService) {
          var ctrl = this;
          var issue = $scope.issue();
          var getPlaythroughIndex = function(playthroughId) {
            return $scope.playthroughIds.indexOf(playthroughId);
          };

          $scope.createPlaythroughNavId = function(playthroughId) {
            return getPlaythroughIndex(playthroughId) + 1;
          };

          var issueResolved = false;
          $scope.resolveIssue = function() {
            if (!issueResolved) {
              PlaythroughIssuesService.resolveIssue(issue);
              AlertsService.addSuccessMessage(
                'Issue resolved. Refresh the page to view changes.');
              issueResolved = true;
            } else {
              AlertsService.addSuccessMessage(
                'Issue has already been resolved. No need to resolve again. ' +
                'Refresh the page to view changes.');
            }
          };

          $scope.showPlaythrough = function(playthroughId) {
            var index = $scope.playthroughIds.indexOf(playthroughId);
            PlaythroughIssuesService.openPlaythroughModal(playthroughId, index);
          };
          ctrl.$onInit = function() {
            $scope.currentIssueIdentifier = $scope.index() + 1;
            $scope.issueStatement =
              PlaythroughIssuesService.renderIssueStatement(issue);
            $scope.suggestions =
              PlaythroughIssuesService.renderIssueSuggestions(issue);
            $scope.playthroughIds = issue.playthroughIds;
          };
        }
      ]
    };
  }]);
