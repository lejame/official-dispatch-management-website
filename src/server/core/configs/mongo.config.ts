import mongoose, { connect } from 'mongoose';
import { DEFAULTS } from '../constants/Defaults';
import logger from './logger.config';

mongoose.set('strictQuery', false);
connect(process.env.MONGODB_URL ?? DEFAULTS.MONGODB_URL, {});

mongoose.connection.on('connected', () => logger.info('Connected to Mongo server'));
