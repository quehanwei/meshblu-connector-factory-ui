import MeshbluHttp from 'browser-meshblu-http'
import { getMeshbluConfig } from '../helpers/authentication'

export function updateDevice({ uuid, properties }, callback) {
  const meshblu = new MeshbluHttp(getMeshbluConfig())
  meshblu.update(uuid, properties, callback)
}

export function updateDeviceDangerously({ uuid, properties }, callback) {
  const meshblu = new MeshbluHttp(getMeshbluConfig())
  meshblu.updateDangerously(uuid, properties, callback)
}

export function getDevice({ uuid }, callback) {
  if (uuid == null) return callback(new Error('Device Not Found'))
  const meshblu = new MeshbluHttp(getMeshbluConfig())
  meshblu.device(uuid, callback)
}

export function sendMessage(message, callback) {
  const meshblu = new MeshbluHttp(getMeshbluConfig())
  meshblu.message(message, callback)
}

export function generateAndStoreToken({ uuid }, callback) {
  const meshblu = new MeshbluHttp(getMeshbluConfig())
  meshblu.generateAndStoreToken(uuid, {}, callback)
}

export function getDevices(callback) {
  const meshbluConfig = getMeshbluConfig()
  const meshblu = new MeshbluHttp(meshbluConfig)
  if (meshblu.uuid == null) {
    return callback(null, [])
  }
  const query = {
    owner: meshbluConfig.uuid,
    connectorMetadata: { $exists: true },
    type: { $ne: 'device:gateblu' },
  }
  const projection = {
    uuid: true,
    name: true,
    type: true,
    online: true,
    lastPong: true,
    connectorMetadata: true,
    statusDevice: true,
    octoblu: true,
  }
  meshblu.search({ query, projection }, callback)
}
