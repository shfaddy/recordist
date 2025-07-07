import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

export default class Recorder {

constructor ( details ) {

this .details = Object .assign ( details, { recorder: this } );

};

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

instr beep

schedule "beep", giMeasure, p3, p4, p5

p3 *= p4

aEnvelope madsr p3/32, p3/32, 1/2^3, p3/32

aNote poscil aEnvelope, cpsmidinn ( p5 )

aNote clip aNote, 1, 1

outch 1, aNote

endin

i_ readscore {{

#define measure #[${ clock .measure } * 60 / ${ clock .tempo }]#
#define key #${ recordist .key }#

i "clock" 0 0 $measure

i "recorder" 0 -1

v $measure

${ score .join ( '\n' ) }

}}

</CsInstruments>

</CsoundSynthesizer>

` .trim (), 'utf8' );

writeFile ( '.take', take .toString (), 'utf8' );

this .engine = spawn ( 'csound', [ path ], { /* stdio: 'inherit' */ } );

_ .interrupt .then (

() => this .engine ? this .engine .kill () : undefined

);

return await new Promise ( ( resolve, reject ) => {

this .engine .on ( 'exit', ( ... status ) => {

status = status .filter ( status => status !== null ) .pop ();

delete this .engine;

if ( status === 0 )
resolve ( true );

else
reject ( "Playing synthesizer is interrupted" );

} );

} );

};

};
