// src/utils/zkp-utils.js
import * as snarkjs from "snarkjs";
import { poseidon } from "circomlib";

export async function generateProof(password, storedHash) {
  // Poseidon hash the password client-side
  const hashedPassword = poseidon([password]);

  // Generate the proof
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { password, storedHash },
    "../zkp/poseidon_auth.wasm",
    "../zkp/poseidon_auth_final.zkey"
  );

  return { proof, publicSignals };
}
