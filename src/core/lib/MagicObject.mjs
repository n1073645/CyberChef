import OperationConfig from "../config/OperationConfig.json";
/**
 * An object used by magic to store the input/output criteria for valid operation results.
 *
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */
class potentialOps {

    /**
     * PotentialOps constructor.
     *
     * @param prevOp
     */
    constructor (prevOp) {
        if (typeof prevOp === "undefined") {
            this.inputRegexes = this.generateInputOpPatterns();
            this.outputRegexes = this.generateOutputOpPatterns();
        } else {
            this.inputRegexes = prevOp.InputRegexes;
            this.outputRegexes = prevOp.OutputRegexes;
        }
    }

    /**
     * Sets the output regexes for the operation.
     *
     * @param outputRegexes
     */
    set OutputRegexes (outputRegexes) {
        this.outputRegexes = [...outputRegexes];
    }

    /**
     * Sets the input regexes for the operation.
     *
     * @param inputRegexes
     */
    set InputRegexes (inputRegexes) {
        this.inputRegexes = [...inputRegexes];
    }

    /**
     * Returns the operations input regexes.
     *
     * @returns {Object[]}
     */
    get InputRegexes () {
        return this.inputRegexes;
    }

    /**
     * Returns the operations output regexes.
     *
     * @returns {Object[]}
     */
    get OutputRegexes () {
        return this.outputRegexes;
    }

    /**
     * Finds operations that claim to be able to decode the input based on regular
     * expression matches.
     *
     * @returns {Object[]}
     */
    findMatchingInputRegexes (inputStr) {
        const matches = [];

        for (const pattern of this.inputRegexes) {
            const regex = new RegExp(pattern.match, pattern.flags);

            if (regex.test(inputStr)) {
                matches.push(pattern);
            }
        }

        return matches;
    }


    /**
     * Generates a list of all patterns that operations claim to be able to decode.
     *
     * @private
     * @returns {Object[]}
     */
    generateInputOpPatterns() {
        const opPatterns = [];
        for (const op in OperationConfig) {
            if (("inputRegexes" in OperationConfig[op]) && !!(OperationConfig[op].inputRegexes))
                OperationConfig[op].inputRegexes.forEach(pattern => {
                    if (pattern.magic)
                        opPatterns.push({
                            op: op,
                            match: pattern.match,
                            flags: pattern.flags,
                            args: pattern.args,
                            useful: pattern.useful || false
                        });
                });
        }

        return opPatterns;
    }

    /**
     * Generates the list of all the operations that have a valid output.
     *
     * @returns {Object[]}
     */
    generateOutputOpPatterns() {
        const opPatterns = [];
        for (const op in OperationConfig) {
            if ((OperationConfig[op].outputRegexes) && !(OperationConfig[op].inputRegexes))
                OperationConfig[op].outputRegexes.forEach(pattern => {
                    if (pattern.magic)
                        opPatterns.push({
                            op: op,
                            match: pattern.match,
                            flags: pattern.flags,
                            shouldMatch: pattern.shouldMatch,
                            args: pattern.args,
                            useful: pattern.useful || false
                        });
                });
        }

        return opPatterns;
    }

}
export default potentialOps;
