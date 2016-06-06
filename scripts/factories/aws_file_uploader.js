angular.module('tourismApp')
  .factory('S3Uploader', function(constants, $rootScope) {
    'use strict';

    var awsUploader = {};
    awsUploader.sizeLimit = constants.s3Info.file_size_limit;
    awsUploader.upload = function(fileToUpload) {

      AWS.config.update({
        accessKeyId: constants.s3Info.access_key,
        secretAccessKey: constants.s3Info.secret_key
      });
      AWS.config.region = constants.s3Info.region;
      var bucket = new AWS.S3({
        params: {
          Bucket: constants.s3Info.bucket
        }
      });

      if (fileToUpload) {
        // Perform File Size Check First
        var fileSize = Math.round(parseInt(fileToUpload.size));
        if (fileSize > this.sizeLimit) {
          $rootScope.showAlert(constants.alerts.hugeFile + this.getFileSizeLabel(), constants.alertTypes.warning);
          return false;
        }

        var params = {
          Key: fileToUpload.uniqueFileName,
          ContentType: fileToUpload.type,
          Body: fileToUpload,
          ServerSideEncryption: constants.s3Info.server_encryption
        };

        bucket.putObject(params, function(err, data) {
          if (err) {
            $rootScope.showAlert(err.message + " " + err.code, constants.alertTypes.error);
            return false;
          } else {
            // Upload Successfully Finished
            $rootScope.console(constants.alerts.uploadSuccess);

            // Reset The Progress Bar
            /*setTimeout(function() {
              $scope.uploadProgress = 0;
              $scope.$digest();
            }, 4000);*/
          }
        })
          .on('httpUploadProgress', function(progress) {
            /*$scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
            $scope.$digest();*/
          });
      } else {
        // No File Selected
        $rootScope.showAlert(constants.alerts.fileMissing, constants.alertTypes.warning);
      }
    }

    awsUploader.getFileSizeLabel = function() {
      // Convert Bytes To MB
      return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB';
    }

    return awsUploader;
  });
