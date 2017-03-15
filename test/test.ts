/// <reference path="../node_modules/@types/node/index.d.ts" />

import * as Fin from "finnlp";
import "../src/index";

function error (msg:string){
    console.error(msg);
    process.exit(1);
}

function assert (sentence:string, hasEmphasis:boolean, expectedIndex?:number){
    const result = new Fin.Run(sentence).emphasis();
    if((!hasEmphasis) && (!!result[0].find((x)=>x > 1))) {
        error(`❌ Failed: sentence "${sentence}" had emphasis while we were not expecting any.`);
    }
    else if(expectedIndex !== undefined){
        const gotIndex = result[0].findIndex((x)=>x > 1);
        const gotValue = result[0].find(x=>x>1);
        if(gotIndex !== expectedIndex) {
            error(`❌ Failed: for sentence ${sentence} we were expecting an emphasis at ${expectedIndex} and we got ${gotIndex}`);
        }
    }
    console.log(`✅ Passed: ${sentence}`);
}

assert("That was extremely good.",true,3);
assert("It's the longest yard in history",true,3);
assert("I saw exactly 3 men going to the party.",true,5);
assert("it literally had been one of the craziest weeks I've ever had",true,3);
assert("I honestly didn't want her to give her opinion",true,4);
assert("That's demonstrably false accusation",true,3);