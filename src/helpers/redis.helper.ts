import { createClient } from 'redis';
import { redisHost, redisPassword, redisPort, redisUserName } from '../secret';

const client = createClient({
    username: redisUserName,
    password: redisPassword,
    socket: {
        host: redisHost!,
        port: Number(redisPort)
    }});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

export default client
