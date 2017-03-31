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
				const nearestParent = findTarget(tokenIndex,sentence);
				result[sentenceIndex][nearestParent] = result[sentenceIndex][nearestParent] + score;
			}
		});
	});

	return result;
};

function nextTag(index:number,sentence:Fin.SentenceResult,test:RegExp,distance:number):number {
	return sentence.tags.findIndex((tag,i)=>{
		return i > index && (i - index) < distance + 1 && test.test(tag);
	});
}

function findTarget(tokenIndex:number,sentence:Fin.SentenceResult):number {

	const parent = sentence.deps[tokenIndex].parent;
	const closestNeighbor = [
		nextTag(tokenIndex,sentence,/N/,1),
		nextTag(tokenIndex,sentence,/C/,1),
		nextTag(tokenIndex,sentence,/J/,1),
		nextTag(tokenIndex,sentence,/N/,2),
		nextTag(tokenIndex,sentence,/C/,2),
		nextTag(tokenIndex,sentence,/J/,2),
	]
	.find(x=>x!==-1);

	if(closestNeighbor !== undefined && closestNeighbor !== -1) return closestNeighbor;
	else if(parent === -1) return tokenIndex;
	else return parent;

}