include "circomlib/circuits/poseidon.circom";

template PasswordHash() {
    signal input password;
    signal input hash;

    signal output out;

    component poseidonHash = Poseidon(1);
    poseidonHash.inputs[0] <== password;

    out <== poseidonHash.out == hash;
}

component main = PasswordHash();
