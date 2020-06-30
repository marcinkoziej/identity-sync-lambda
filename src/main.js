import {crypto, service, config} from 'proca_cli'
import * as Sentry from '@sentry/node';

Sentry.configureScope((scope) => {
  scope.setExtra("config", config)
})

function sentryHandler(lambdaHandler) {
  return async (event, context) => {
    try {
      return await lambdaHandler(event, context);
    } catch (error) {
      Sentry.captureException(error);
      await Sentry.flush(2000);
      throw error;
    }
  };
}

// Handler
async function identitySync(event, context) {
  const sync_all = event.Records.map(record => {
    let action = JSON.parse(record.body)
    action = crypto.decryptAction(action, config)

    const syncing = service.identity.syncAction(action, config)
          .then((v) => {
            return { ok: true }
          })
          .catch((e) => {
            console.error(`Error syncing action to identity ${e}`)
            console.error('Config:', JSON.stringify(config))
            throw e
          })
    return syncing
  })

  return Promise.all(sync_all)
}



if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  exports.handler = sentryHandler(identitySync)
} else {
  exports.handler = identitySync
}
