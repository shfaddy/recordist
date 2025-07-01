import { writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

export default class Recorder {

constructor ( details ) {

this .details = Object .assign ( details, { recorder: this } );

};

path = {

recorder: 'recorder.csd',
recording: 'recording.wav'

};

async $_director ( _, ... argv ) {

if ( typeof argv [ 0 ] === 'symbol' )
return;

if ( argv .length )
throw `I don't know what you mean by: "${ argv .join ( ' ' ) }"?`;

const { tempo, measure } = this .details .clock;

await writeFile ( this .path .recorder, `

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

fout "${ this .path .recording }", -1, aRecording

endin

instr beep

schedule "beep", p3, p3, p4, p5

p3 *= p4

aEnvelope madsr p3/32, p3/32, 1/2^3, p3/32

aNote poscil aEnvelope, cpsmidinn ( p5 )

aNote clip aNote, 1, 1

outch 1, aNote

endin

scoreline_i {{

i "recorder" 0 10000

i "beep" 0 ${ measure * 60 / tempo } ${ 1/4 } 60

}}

</CsInstruments>

</CsoundSynthesizer>

` .trim (), 'utf8' );

this .engine = spawn ( 'csound', [ this .path .recorder ], { /* stdio: 'inherit' */ } );

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
