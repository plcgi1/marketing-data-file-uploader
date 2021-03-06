/**
*  Copyright (c) 2017-present, Facebook, Inc.
*  All rights reserved.
*  
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*  
*  @generated
**/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = undefined;

var _ConfigsBuilder = require('./ConfigsBuilder');

var _Logger = require('./Logger');

var _FeedFileHandler = require('./FeedFileHandler');

var _SampledEventsTester = require('./SampledEventsTester');

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _ErrorTypes = require('./ErrorTypes');

var _EventsUploader = require('./EventsUploader');

var winston = require('winston');

winston.level = process.env.MDFU_LOG_LEVEL || 'info';

var upload = exports.upload = function upload() {
  var _buildConfigs = (0, _ConfigsBuilder.buildConfigs)(),
      configs = _buildConfigs.configs,
      err = _buildConfigs.err;

  if (err) {
    winston.level = 'error';
    (0, _Logger.initializeLogger)().error(err.message);
    process.exit();
  }
  if (configs) {
    switch (configs.mode) {
      case _FeedUploaderConstants.MODE_CA:
      case _FeedUploaderConstants.MODE_OC:
        {
          winston.level = configs.logging;
          (0, _Logger.initializeLogger)();
          (0, _SampledEventsTester.testSampledEvents)(configs, function (err) {
            var rowName = _FeedUploaderConstants.MODE_ROW_NAMES[configs.mode];
            if (err) {
              (0, _Logger.getLogger)().error(err.message);
            } else if (configs.testOnly) {
              (0, _Logger.getLogger)().info('Sampled ' + rowName + ' set passed the test.');
            } else if (configs.mode === _FeedUploaderConstants.MODE_CA && !configs.customAudienceId) {
              (0, _EventsUploader.createCustomAudience)(configs, _uploadCallback);
            } else {
              _uploadCallback(configs);
            }
          });
        }
        break;
      case _FeedUploaderConstants.MODE_VER:
        break;
      default:
        throw new Error(_ErrorTypes.UNSUPPORTED_MODE);
    }
  }
};

var _uploadCallback = function _uploadCallback(configs) {
  var rowName = _FeedUploaderConstants.MODE_ROW_NAMES[configs.mode];
  (0, _Logger.getLogger)().info('Sampled ' + rowName + ' look ok.');
  (0, _Logger.getLogger)().info('STEP 2. Uploading the ' + rowName);
  (0, _FeedFileHandler.parseAndNormalizeFeedFile)(configs);
};