#!/usr/bin/env node

import Recordist from '@shfaddy/recordist';
import Scenarist from '@shfaddy/scenarist/shell';

try {

await new Scenarist ( new Recordist ) .publish ();

} catch ( error ) {

console .error ( "Scenarist got killed!" );
console .error ( error );

}
