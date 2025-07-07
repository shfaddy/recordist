export default class Device {

$_parameter ( _, parameter, ... argv ) {

if ( ! argv .length )
return this [ parameter ];

/*
if ( isNaN ( argv [ 0 ] [ 0 ] ) )
throw `Cannot set ${ parameter } to the value of ${ argv .shift () }`;
*/

this [ parameter ] = argv .shift ();

return this [ parameter ];

};

};
