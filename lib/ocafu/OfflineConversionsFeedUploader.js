/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadConversionsFeed = undefined;

var _ConfigsBuilder = require('./ConfigsBuilder');

var _Logger = require('./Logger');

var _FeedFileHandler = require('./FeedFileHandler');

var _SampledEventsTester = require('./SampledEventsTester');

var winston = require('winston');

winston.level = process.env.OCAFU_LOG_LEVEL || 'info';

var uploadConversionsFeed = exports.uploadConversionsFeed = function uploadConversionsFeed() {
  var _buildConfigs = (0, _ConfigsBuilder.buildConfigs)(),
      configs = _buildConfigs.configs,
      err = _buildConfigs.err;

  if (err) {
    winston.level = 'error';
    (0, _Logger.initializeLogger)().error(err.message);
    process.exit();
  }
  if (configs) {
    winston.level = configs.logging;
    (0, _Logger.initializeLogger)();
    (0, _SampledEventsTester.testSampledEvents)(configs, function (err) {
      if (err) {
        (0, _Logger.getLogger)().error(err.message);
      } else if (configs.testOnly) {
        (0, _Logger.getLogger)().info('Sampled events set passed the test.');
      } else {
        (0, _Logger.getLogger)().info('Sampled events look ok.');
        (0, _Logger.getLogger)().info('STEP 2. Uploading the events');
        (0, _FeedFileHandler.parseAndNormalizeFeedFile)(configs);
      }
    });
  }
};