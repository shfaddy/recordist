import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

export default class Engine {

constructor ( details ) {

this .details = Object .assign ( details, { recorder: this } );

};

$on () { return this .record = true, 'on' };
$offf () { return this .record = false, 'off'; }

async $_director ( _, ... argv ) {

if ( typeof argv [ 0 ] === 'symbol' )
return;

if ( argv .length )
throw `I don't know what you mean by: "${ argv .join ( ' ' ) }"?`;

const { recordist, clock, score } = this .details;
const path = recordist .title + '.csd';
let take;

try { take = parseInt ( await readFile ( '.take', 'utf8' ) ) } catch ( _ ) {}

if ( isNaN ( take ) )
take = 0;

await writeFile ( path, `

<CsoundSynthesizer>

<CsOptions>

-iadc
-odac

</CsOptions>

<CsInstruments>

sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

instr recorder

aRecording inch 2

fout "${ recordist .title }.${ ++take }.wav", -1, aRecording

endin

instr clock

giMeasure init p4

endin

instr 1, beep

if p3 > 0 then

schedule "beep", giMeasure, p3, p4, p5

p3 *= p4

endif

aEnvelope madsr abs ( p3 ) /32, abs ( p3 ) /32, 1/2^3, abs ( p3 ) /32

aNote poscil aEnvelope, cpsmidinn ( p5 )

chnmix aNote / ( p6 + 1 ), "mix"

endin

alwayson "mixer"

instr mixer

aNote chnget "mix"

aNote clip aNote, 1, 1

outch 1, aNote

chnclear "mix"

endin

i_ readscore {{

#define measure #[${ clock .measure } * 60 / ${ clock .tempo }]#
#define key #${ recordist .key }#

i 1.13 0 -1 1 [$key-12*0] 2^8

i "clock" 0 0 $measure

${ this .record !== true ? '; ' : '' }i "recorder" 0 -1

v $measure

${ score .join ( '\n' ) }

}}

</CsInstruments>

</CsoundSynthesizer>

` .trim (), 'utf8' );

writeFile ( '.take', take .toString (), 'utf8' );

this .process = spawn ( 'csound', [ path ], { stdio: 'ignore' } );

_ .interrupt .then (

() => this .process ? this .process .kill () : undefined

);

return await new Promise ( ( resolve, reject ) => {

this .process .on ( 'exit', ( ... status ) => {

status = status .filter ( status => status !== null ) .pop ();

delete this .process;

if ( status === 0 )
resolve ( true );

else
reject ( "Playing synthesizer is interrupted" );

} );

} );

};

};
