import Recorder from './recorder.js';
import Clock from './clock.js';

export default class Recordist {

constructor ( details = {} ) {

this .$beat = new Clock ( details );
this .$record = new Recorder ( details );

};

};
