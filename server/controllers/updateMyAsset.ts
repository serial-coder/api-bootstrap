/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as config from 'config';
import * as express from 'express';
import { Contract } from 'fabric-network';
import { getLogger } from 'log4js';

import * as util from '../helpers/util';

const logger = getLogger('controllers - createMyAsset');
logger.level = config.get('logLevel');

const updateMyAsset = async (req: express.Request, res: express.Response) => {
  logger.debug('entering >>> updateMyAsset()');

  let jsonRes;
  try {
    // More info on the following calls: https://fabric-sdk-node.github.io/Contract.html

    // Get contract instance retrieved in fabric-routes middleware
    const contract: Contract = res.locals.defaultchannel.mycontract;

    // Invoke transaction
    // Create transaction proposal for endorsement and sendTransaction to orderer
    const key = req.params.assetId;
    const value = req.body.value;
    logger.debug('key: ' + key);
    logger.debug('value: ' + value);
    const invokeResponse = await contract.submitTransaction('updateMyAsset', key, value);

    jsonRes = {
      result: JSON.parse(invokeResponse.toString()),
      statusCode: 200,
      success: true,
    };
  } catch (err) {
    jsonRes = {
      message: `${err.message}`,
      statusCode: 500,
      success: false,
    };
  }

  logger.debug('exiting <<< updateMyAsset()');
  util.sendResponse(res, jsonRes);
};

export { updateMyAsset as default };
