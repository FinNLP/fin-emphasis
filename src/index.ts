import * as dict from "./dictionary";
import * as Fin from "finnlp";

declare module "finnlp" {
	export interface Run {
		emphasis:(this:Fin.Run)=>number[][];
	}
}

Fin.Run.prototype.emphasis = function(){
	const result:number[][] = [];

	// initialize all with false
	this.sentences.forEach((sentence,sentenceIndex)=>{
		result[sentenceIndex] = [];
		sentence.tokens.forEach((token,tokenIndex)=>{
			result[sentenceIndex][tokenIndex] = 1;
		});
	});

	this.sentences.forEach((sentence,sentenceIndex)=>{

		// 1. RBS & JJS
		const tags = sentence.tags;
		tags.forEach((tag,tagIndex)=>{
			if(tag==="JJS")
				result[sentenceIndex][tagIndex]++;
			else if(tag==="RBS")
				result[sentenceIndex][tagIndex]++;
		});

		// 2. Adverbs of emphasis
		const tokens = sentence.tokens;
		tokens.forEach((token,tokenIndex)=>{
			const score = dict.adverbsOfEmphasis[token.toLowerCase()];
			if(score) {
				const nearestParent = findTarget(sentenceIndex,tokenIndex,this);
				result[sentenceIndex][nearestParent] = result[sentenceIndex][nearestParent] + score;
			}
		});
	});

	return result;
};

function findTarget(sentenceIndex:number,tokenIndex:number,input:Fin.Run):number{
	const possibleCloseNeighbors = ["N","J"];
	const closestNeighbor = input.sentences[sentenceIndex].tags[tokenIndex+1];
	const secondMostCloseNeighbor = input.sentences[sentenceIndex].tags[tokenIndex+2];
	const parent = input.sentences[sentenceIndex].deps[tokenIndex].parent;
	
	if(~possibleCloseNeighbors.indexOf(closestNeighbor.charAt(0))) return tokenIndex+1;
	if(~possibleCloseNeighbors.indexOf(secondMostCloseNeighbor.charAt(0))) return tokenIndex+2;
	else if(parent === -1) return tokenIndex;
	else return parent;
}