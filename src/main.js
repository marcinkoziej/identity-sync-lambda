import {crypto, service, config} from 'proca_cli'

// Handler
exports.handler = async function(event, context) {
  const sync_all = event.Records.map(record => {
    let action = JSON.parse(record.body)
    action = crypto.decryptAction(action, config)

    const syncing = service.identity.syncAction(action, config)
          .then((v) => {
            return { ok: true }
          })
          .catch((e) => {
            console.error(`Error syncing action to identity ${e}`)
            throw e
          })
    return syncing
  })

  return Promise.all(sync_all)
}
