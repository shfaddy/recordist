import Device from './device.js';

export default class Player extends Device {

constructor ( details ) {

super ();

this .details = Object .assign ( details, { player: this } );

};

async $_director ( _, ... argv ) {

if ( ! argv .length )
return;

if ( typeof argv [ 0 ] === 'symbol' )
return;

const { score, instrument } = this .details;

await _ .play ( Symbol .for ( 'parameter' ), 'duration', argv .shift () );
await _ .play ( Symbol .for ( 'parameter' ), 'detune', argv .shift () );

score .push ( [

`i "${ instrument }"`,
this .playing !== true ? ( this .playing = true, 0 ) : '+',
`[${ this .duration }]`,
`[${ this .duration }]`,
`[ $key + ${ this .detune }]`

] .join ( ' ' ) );

return _ .play ( _, ... argv );

};

};
