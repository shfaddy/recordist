export default class Clock {

constructor ( details ) {

this .details = Object .assign ( details, { clock: this } );

};

tempo = 120;

$at ( _, ... argv ) {

if ( ! argv .length )
throw "At what tempo?";

if ( isNaN ( argv [ 0 ] ) )
throw `Cannot set tempo to the value of ${ argv .shift () }`;

this .tempo = parseFloat ( argv .shift () );

return _ .play ( _, ... argv );

};

measure = 2;

$over ( _, ... argv ) {

if ( ! argv .length )
throw "Over which measure?";

if ( isNaN ( argv [ 0 ] ) )
throw `Cannot set measure to the value of ${ argv .shift () }`;

this .measure = parseFloat ( argv .shift () );

return _ .play ( _, ... argv );

};

};
