pragma circom 2.1.9;

include "./circomlib/circuits/poseidon.circom";

template PasswordAuth() {
    signal input password; // User-provided password
    signal input storedHash; // Hash stored on the server
    signal output isValid; // Output signal to indicate success or failure

    // Compute the Poseidon hash of the input password
    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== password;

    // Check if the computed hash matches the stored hash
    signal isEqual;
    isEqual <== poseidon.out - storedHash;

    // If isEqual is 0, then the hashes match, so isValid is 1. Otherwise, it's 0.
    isValid <== 1 - isEqual * isEqual;
}

component main = PasswordAuth();
