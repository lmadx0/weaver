'use strict';

angular.module('ariadneApp')
  .controller('EntitiesCtrl', function ($scope, apiFactory) {
    $scope.entityFilter = "PERSON"

    apiFactory.get().then(function(data) {
      $scope.db = data
      $scope.entities = $scope.db.entities;
      console.log(data)
    });

  });
