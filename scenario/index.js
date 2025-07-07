import Device from './device.js';
import Clock from './clock.js';
import Recorder from './recorder.js';
import Player from './player.js';

export default class Recordist extends Device {

constructor ( details = {} ) {

super ();

this .details = Object .assign ( details, {

recordist: this,
score: []

} );

this .$clock = new Clock ( details );
this .$beep = new Player ( Object .assign ( Object .create ( details ), { instrument: 'beep' } ) );
this .$record = new Recorder ( details );

};

title = 'recording';

$title ( _, ... argv ) {

return ! argv .length ? this .title : this .title = argv .join ( '-' );

};

key = 64;

$key ( _, ... argv ) { return _ .play ( _, Symbol .for ( 'parameter' ), 'key', ... argv ) };

};
