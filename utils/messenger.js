const kafka = require('kafka-node');
const config = require('../config/config');


module.exports.send = async function(topic,messageObject)
{
    try {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({kafkaHost: config.kafka_server});
        const producer = new Producer(client);
        const kafka_topic = topic;
        console.log(kafka_topic);

        //Stringified the message to send it via kafka
      
        let msg = JSON.stringify(messageObject);
      
        let payloads = [
          {
            topic: kafka_topic,
            messages: msg
          }
        ];
      
        producer.on('ready', async function() {
          let push_status = await producer.send(payloads, (err, data) => {
            if (err) {
              console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
            } else {
              console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
            }
          });
        });
      
        await producer.on('error', function(err) {
          console.log(err);
          console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
          throw err;
        });
      }
      catch(e) {
        console.log(e);
      }
};

