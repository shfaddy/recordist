import Device from './device.js';

export default class Clock extends Device {

constructor ( details ) {

super ();

this .details = Object .assign ( details, { clock: this } );

};

tempo = 120;

$tempo ( _, ... argv ) { return _ .play ( _, Symbol .for ( 'parameter' ), 'tempo', ... argv ) };

measure = 2;

$measure ( _, ... argv ) { return _ .play ( _, Symbol .for ( 'parameter' ), 'measure', ... argv ) };

$_value ( _, parameter, ... argv ) {

if ( ! argv .length )
return this [ parameter ];

if ( isNaN ( argv [ 0 ] [ 0 ] ) )
throw `Cannot set ${ parameter } to the value of ${ argv .shift () }`;

this [ parameter ] = argv .shift ();

return _ .play ( parameter );

};

};
