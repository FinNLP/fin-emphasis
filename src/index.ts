import * as dict from "./dictionary";
import {Fin} from "finnlp";

/**
 * Expand namespace
**/
export namespace Fin {
	export interface FinReturn {
		empshasis:()=>number[][];
	}
}

/**
 * Calcualte empshasis
**/
export function empshasis(input:Fin.FinReturn){
	const calculateEmphasis = function () {
		const empshasisPoints:number[][] = [];
		// initialize all with false
		input.tokens.forEach((sentenceTokens,sentenceIndex)=>{
			empshasisPoints[sentenceIndex] = [];
			sentenceTokens.forEach((token,tokenIndex)=>{
				empshasisPoints[sentenceIndex][tokenIndex] = 1;
			});
		});
		// RBS & JJS
		input.tokens.forEach((sentence,sentenceIndex)=>{
			sentence.forEach((tag,tagIndex)=>{
				if(tag === "JJS") {
					const targetIndex = findNearestParent(sentenceIndex,tagIndex,"N");
					empshasisPoints[sentenceIndex][targetIndex] = empshasisPoints[sentenceIndex][targetIndex] + 1;
				}
				else if(tag === "RBS") {
					const targetIndex = findNearestParent(sentenceIndex,tagIndex,"V");
					empshasisPoints[sentenceIndex][targetIndex] = empshasisPoints[sentenceIndex][targetIndex] + 1;
				}
			});
		});
		// Adverbs of emphasis
		input.tokens.forEach((sentence,sentenceIndex)=>{
			sentence.forEach((token,tokenIndex)=>{
				const score = dict.adverbsOfEmphasis[token.toLowerCase()];
				if(score) {
					const targetIndex = findNearestParent(sentenceIndex,tokenIndex,"V");
					empshasisPoints[sentenceIndex][targetIndex] = empshasisPoints[sentenceIndex][targetIndex] + score;
				}
			});
		});
		return empshasisPoints;
	};
	return Object.assign(input,{negation:calculateEmphasis});

	function findNearestParent(sentenceIndex:number,tokenIndex:number,tag:string):number{
		const parent = input.deps[sentenceIndex][tokenIndex].parent;
		if(parent === -1) return tokenIndex;
		else if(input.tags[sentenceIndex][parent].charAt(0) === tag) return parent;
		else return findNearestParent(sentenceIndex,parent,tag);
	}
}